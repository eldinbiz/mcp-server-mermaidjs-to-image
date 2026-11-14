import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import puppeteer, { Browser, BrowserContext, Page } from 'puppeteer';
import {
  RenderResult,
  Theme,
  Look,
  resolveEffectiveBackground,
  resolveEffectivePadding,
} from './types.js';
import { buildDiagnosticReport } from './diagnostics.js';

const require = createRequire(import.meta.url);

export interface RenderOptions {
  mermaidSyntax: string;
  diagramType?: string;
  outputPath?: string;
  theme?: Theme;
  look?: Look;
  background?: string;
  padding?: number;
  scale?: number;
  width?: number;
  height?: number;
}

export interface RendererPoolStats {
  poolSize: number;
  inUseCount: number;
  creatingCount: number;
  waitQueueLength: number;
  cacheEntries: number;
  cacheBytes: number;
}

interface ViewportConfig {
  width: number;
  height: number;
  deviceScaleFactor: number;
}

interface PooledPage {
  context: BrowserContext;
  page: Page;
  inUse: boolean;
  tainted: boolean;
  renderCount: number;
  lastUsedAt: number;
  lastViewport: ViewportConfig;
}

interface CachedPngEntry {
  pngBuffer: Buffer;
  base64Png: string;
  width: number;
  height: number;
  padding: number;
}

const MERMAID_MAX_TEXT_SIZE = 200_000;
const MERMAID_MAX_EDGES = 2_000;
const DEFAULT_MIN_WARM_PAGES = 1;
const DEFAULT_MAX_PAGES = 3;
const DEFAULT_BURST_IDLE_MS = 30_000;
const DEFAULT_MAX_RENDERS_PER_PAGE = 100;
const DEFAULT_RENDER_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_CACHE_ENTRIES = 50;
const DEFAULT_MAX_CACHE_BYTES = 32 * 1024 * 1024; // 32 MB

function normalizeSyntaxHeader(syntax: string, diagramType?: string): string {
  if (!syntax) return syntax;

  if (diagramType === 'usecase-beta') {
    return syntax.replace(/^(\s*)(use-case|usecase)(\s|$)/im, '$1usecase-beta$3');
  }

  if (diagramType === 'swimlane-beta') {
    return syntax.replace(/^(\s*)(swimlane|swimlanes)(\s|$)/im, '$1swimlane-beta$3');
  }

  return syntax;
}

export class MermaidRenderer {
  private browser: Browser | null = null;
  private browserLaunchPromise: Promise<Browser> | null = null;
  private prewarmPromise: Promise<void> | null = null;
  private idleTimer: NodeJS.Timeout | null = null;
  private burstTimer: NodeJS.Timeout | null = null;
  private readonly idleTimeoutMs: number = 5 * 60 * 1000; // 5 minutes
  private readonly burstIdleMs: number = DEFAULT_BURST_IDLE_MS;
  private readonly minWarmPages: number = DEFAULT_MIN_WARM_PAGES;
  private readonly maxPages: number = DEFAULT_MAX_PAGES;
  private readonly maxRendersPerPage: number = DEFAULT_MAX_RENDERS_PER_PAGE;
  private readonly renderTimeoutMs: number = DEFAULT_RENDER_TIMEOUT_MS;
  private readonly maxCacheEntries: number = DEFAULT_MAX_CACHE_ENTRIES;
  private readonly maxCacheBytes: number = DEFAULT_MAX_CACHE_BYTES;
  private mermaidScript: string | null = null;

  private pool: PooledPage[] = [];
  private creatingCount = 0;
  private waitQueue: Array<{
    resolve: (entry: PooledPage) => void;
    reject: (err: Error) => void;
  }> = [];
  private generation = 0;
  private isClosing = false;

  private cache = new Map<string, CachedPngEntry>();
  private totalCacheBytes = 0;

  constructor(idleTimeoutMinutes: number = 5) {
    this.idleTimeoutMs = idleTimeoutMinutes * 60 * 1000;
  }

  /**
   * Expose pool and cache telemetry for tests and monitoring
   */
  public getPoolStats(): RendererPoolStats {
    return {
      poolSize: this.pool.length,
      inUseCount: this.pool.filter((p) => p.inUse).length,
      creatingCount: this.creatingCount,
      waitQueueLength: this.waitQueue.length,
      cacheEntries: this.cache.size,
      cacheBytes: this.totalCacheBytes,
    };
  }

  /**
   * Resolve and cache the Mermaid standalone library script
   */
  private getMermaidScript(): string {
    if (this.mermaidScript) {
      return this.mermaidScript;
    }

    try {
      const scriptPath = require.resolve('mermaid/dist/mermaid.min.js');
      this.mermaidScript = fs.readFileSync(scriptPath, 'utf8');
      return this.mermaidScript;
    } catch (err: any) {
      throw new Error(`Failed to locate Mermaid.js bundle: ${err?.message || err}`);
    }
  }

  /**
   * Search for an installed Chrome or Edge executable on the machine as a fallback
   */
  private findSystemExecutable(): string | undefined {
    const candidates: string[] = [];

    if (process.platform === 'win32') {
      const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
      const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
      const localAppData = process.env['LOCALAPPDATA'] || '';

      candidates.push(
        path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(localAppData, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe')
      );
    } else if (process.platform === 'darwin') {
      candidates.push(
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/Applications/Chromium.app/Contents/MacOS/Chromium'
      );
    } else {
      // Linux
      candidates.push(
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/snap/bin/chromium'
      );
    }

    for (const p of candidates) {
      if (p && fs.existsSync(p)) {
        return p;
      }
    }

    return undefined;
  }

  /**
   * Get or launch the headless browser singleton safely (coalescing concurrent launches)
   */
  public async getBrowser(): Promise<Browser> {
    this.resetIdleTimer();

    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    if (this.browserLaunchPromise) {
      return this.browserLaunchPromise;
    }

    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ];

    const launchPromise = (async () => {
      let launchedBrowser: Browser;
      try {
        launchedBrowser = await puppeteer.launch({
          headless: true,
          args: launchArgs,
        });
      } catch (primaryErr: any) {
        const fallbackExecutable = this.findSystemExecutable();
        if (!fallbackExecutable) {
          throw new Error(
            `Failed to launch bundled Chromium and no system Chrome/Edge was found. Details: ${primaryErr.message}`
          );
        }

        launchedBrowser = await puppeteer.launch({
          headless: true,
          executablePath: fallbackExecutable,
          args: launchArgs,
        });
      }

      if (this.isClosing) {
        await launchedBrowser.close().catch(() => {});
        throw new Error('MermaidRenderer is closing.');
      }

      this.browser = launchedBrowser;
      this.browser.on('disconnected', () => {
        if (this.browser === launchedBrowser) {
          this.browser = null;
          this.pool = [];
        }
      });

      return launchedBrowser;
    })();

    this.browserLaunchPromise = launchPromise;
    try {
      return await launchPromise;
    } finally {
      if (this.browserLaunchPromise === launchPromise) {
        this.browserLaunchPromise = null;
      }
    }
  }

  /**
   * Close a pooled page and its isolated BrowserContext safely
   */
  private async disposePooledPage(entry: PooledPage): Promise<void> {
    entry.tainted = true;
    entry.inUse = false;
    await entry.page.close().catch(() => {});
    await entry.context.close().catch(() => {});
  }

  /**
   * Create and pre-load a warm Puppeteer page in an isolated BrowserContext with offline network hardening
   */
  private async createWarmPage(browser: Browser): Promise<PooledPage> {
    const initialViewport: ViewportConfig = {
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    };

    const context = await browser.createBrowserContext();
    let page: Page;
    try {
      page = await context.newPage();
    } catch (err) {
      await context.close().catch(() => {});
      throw err;
    }

    try {
      await page.setViewport(initialViewport);

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style data-mcp-base="true">
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      display: inline-block;
    }
    #container {
      display: inline-block;
      padding: 24px;
      margin: 0;
    }
    #container svg {
      display: block;
    }
  </style>
</head>
<body>
  <div id="container"></div>
</body>
</html>`;

      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const scriptContent = this.getMermaidScript();
      await page.addScriptTag({ content: scriptContent });

      // Block outbound HTTP/HTTPS network requests to prevent external hangs or SSRF
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.isInterceptResolutionHandled()) return;
        const url = req.url();
        if (url.startsWith('http://') || url.startsWith('https://')) {
          req.abort('blockedbyclient').catch(() => {});
        } else {
          req.continue().catch(() => {});
        }
      });

      const entry: PooledPage = {
        context,
        page,
        inUse: false,
        tainted: false,
        renderCount: 0,
        lastUsedAt: Date.now(),
        lastViewport: initialViewport,
      };

      page.on('close', () => {
        entry.tainted = true;
      });
      page.on('error', () => {
        entry.tainted = true;
      });

      return entry;
    } catch (err) {
      await page.close().catch(() => {});
      await context.close().catch(() => {});
      throw err;
    }
  }

  /**
   * Opportunistically warm up Chromium and 1 warm page in the background (safe fire-and-forget)
   */
  public async prewarm(): Promise<void> {
    if (this.isClosing) return;

    if (this.pool.some((p) => !p.tainted && !p.page.isClosed())) {
      this.resetIdleTimer();
      return;
    }

    if (this.prewarmPromise) {
      return this.prewarmPromise;
    }

    const genAtStart = this.generation;
    const warmTask = (async () => {
      try {
        const browser = await this.getBrowser();
        if (this.isClosing || this.generation !== genAtStart) return;
        if (this.pool.length + this.creatingCount >= this.minWarmPages) return;

        this.creatingCount++;
        try {
          const entry = await this.createWarmPage(browser);
          if (this.isClosing || this.generation !== genAtStart || entry.tainted) {
            await this.disposePooledPage(entry);
            return;
          }
          const waiter = this.waitQueue.shift();
          if (waiter) {
            entry.inUse = true;
            this.pool.push(entry);
            waiter.resolve(entry);
          } else {
            this.pool.push(entry);
          }
        } finally {
          this.creatingCount--;
          this.dispatchWaiters(genAtStart);
        }
      } catch {
        // Swallow opportunistic prewarm failures; explicit renders surface errors normally
      }
    })();

    this.prewarmPromise = warmTask;
    try {
      await warmTask;
    } finally {
      if (this.prewarmPromise === warmTask) {
        this.prewarmPromise = null;
      }
    }
  }

  /**
   * Wake up waiting callers when idle capacity or room for a new page opens
   */
  private dispatchWaiters(expectedGen: number): void {
    if (this.isClosing || this.generation !== expectedGen || this.waitQueue.length === 0) {
      return;
    }

    for (const entry of this.pool) {
      if (this.waitQueue.length === 0) break;
      if (!entry.inUse && !entry.tainted && !entry.page.isClosed()) {
        const waiter = this.waitQueue.shift();
        if (waiter) {
          entry.inUse = true;
          waiter.resolve(entry);
        }
      }
    }

    while (this.waitQueue.length > 0 && this.pool.length + this.creatingCount < this.maxPages) {
      const waiter = this.waitQueue.shift();
      if (!waiter) break;

      this.creatingCount++;
      this.getBrowser()
        .then((browser) => this.createWarmPage(browser))
        .then((entry) => {
          this.creatingCount--;
          if (this.isClosing || this.generation !== expectedGen) {
            void this.disposePooledPage(entry);
            waiter.reject(new Error('MermaidRenderer closed while creating pooled page.'));
            return;
          }
          entry.inUse = true;
          this.pool.push(entry);
          waiter.resolve(entry);
        })
        .catch((err) => {
          this.creatingCount--;
          waiter.reject(err instanceof Error ? err : new Error(String(err)));
          this.dispatchWaiters(expectedGen);
        });
    }
  }

  /**
   * Acquire an initialized warm page from the bounded dynamic pool
   */
  private async acquirePage(): Promise<{ entry: PooledPage; generation: number }> {
    if (this.isClosing) {
      throw new Error('MermaidRenderer is closing.');
    }

    const expectedGen = this.generation;
    this.resetIdleTimer();

    // Purge any stale tainted idle pages before scanning
    const taintedIdle: PooledPage[] = [];
    for (let i = this.pool.length - 1; i >= 0; i--) {
      const candidate = this.pool[i];
      if (!candidate.inUse && (candidate.tainted || candidate.page.isClosed())) {
        this.pool.splice(i, 1);
        taintedIdle.push(candidate);
      }
    }
    if (taintedIdle.length > 0) {
      await Promise.all(taintedIdle.map((c) => this.disposePooledPage(c)));
    }

    // 1. Reuse existing healthy idle page
    for (const candidate of this.pool) {
      if (!candidate.inUse && !candidate.tainted && !candidate.page.isClosed()) {
        candidate.inUse = true;
        return { entry: candidate, generation: expectedGen };
      }
    }

    // 2. Scale up dynamic pool up to maxPages
    if (this.pool.length + this.creatingCount < this.maxPages) {
      this.creatingCount++;
      try {
        const browser = await this.getBrowser();
        const entry = await this.createWarmPage(browser);
        if (this.isClosing || this.generation !== expectedGen) {
          await this.disposePooledPage(entry);
          throw new Error('MermaidRenderer closed while allocating page.');
        }
        entry.inUse = true;
        this.pool.push(entry);
        return { entry, generation: expectedGen };
      } finally {
        this.creatingCount--;
        this.dispatchWaiters(expectedGen);
      }
    }

    // 3. Queue until a pooled page becomes available
    const entry = await new Promise<PooledPage>((resolve, reject) => {
      this.waitQueue.push({ resolve, reject });
    });
    return { entry, generation: expectedGen };
  }

  /**
   * Return a page to the pool (or discard & recycle if tainted/exhausted)
   */
  private releasePage(entry: PooledPage, expectedGen: number): void {
    const shouldDiscard =
      this.isClosing ||
      this.generation !== expectedGen ||
      entry.tainted ||
      entry.page.isClosed() ||
      entry.renderCount >= this.maxRendersPerPage;

    if (shouldDiscard) {
      const idx = this.pool.indexOf(entry);
      if (idx !== -1) {
        this.pool.splice(idx, 1);
      }
      void this.disposePooledPage(entry);
      this.dispatchWaiters(expectedGen);
      this.scheduleBurstCleanup();
      return;
    }

    entry.lastUsedAt = Date.now();
    const nextWaiter = this.waitQueue.shift();
    if (nextWaiter) {
      nextWaiter.resolve(entry);
      return;
    }

    entry.inUse = false;
    this.scheduleBurstCleanup();
  }

  /**
   * Trim excess warm pages above minWarmPages after burst activity settles
   */
  private scheduleBurstCleanup(): void {
    if (this.burstTimer) {
      clearTimeout(this.burstTimer);
      this.burstTimer = null;
    }

    const idlePagesCount = this.pool.filter((p) => !p.inUse).length;
    if (this.pool.length <= this.minWarmPages || idlePagesCount === 0) {
      return;
    }

    this.burstTimer = setTimeout(() => {
      this.burstTimer = null;
      let i = this.pool.length - 1;
      while (i >= 0 && this.pool.length > this.minWarmPages) {
        const candidate = this.pool[i];
        if (!candidate.inUse && Date.now() - candidate.lastUsedAt >= this.burstIdleMs - 50) {
          this.pool.splice(i, 1);
          void this.disposePooledPage(candidate);
        }
        i--;
      }
    }, this.burstIdleMs);

    if (this.burstTimer.unref) {
      this.burstTimer.unref();
    }
  }

  /**
   * Reset the idle timer that shuts down the browser after periods of inactivity
   */
  private resetIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    this.idleTimer = setTimeout(async () => {
      await this.close();
    }, this.idleTimeoutMs);

    // Prevent this timer from keeping the Node process alive when idle
    if (this.idleTimer.unref) {
      this.idleTimer.unref();
    }
  }

  /**
   * Close all pooled pages and the browser instance immediately
   */
  public async close(): Promise<void> {
    this.isClosing = true;
    this.generation++;

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (this.burstTimer) {
      clearTimeout(this.burstTimer);
      this.burstTimer = null;
    }

    // Reject any pending waiters cleanly
    while (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift();
      waiter?.reject(new Error('MermaidRenderer was closed.'));
    }

    if (this.browserLaunchPromise) {
      await this.browserLaunchPromise.catch(() => {});
    }
    if (this.prewarmPromise) {
      await this.prewarmPromise.catch(() => {});
    }

    const pagesToClose = [...this.pool];
    this.pool = [];
    await Promise.all(pagesToClose.map((p) => this.disposePooledPage(p)));

    if (this.browser) {
      try {
        await this.browser.close();
      } catch {
        // ignore errors during shutdown
      }
      this.browser = null;
    }

    this.isClosing = false;
  }

  /**
   * Compute a deterministic SHA-256 cache key for normalized render parameters
   */
  private buildCacheKey(params: {
    effectiveSyntax: string;
    theme?: Theme;
    look?: Look;
    effectiveBackground: string;
    effectivePadding: number;
    scale: number;
    width?: number;
    height?: number;
  }): string {
    return crypto
      .createHash('sha256')
      .update(
        JSON.stringify([
          params.effectiveSyntax,
          params.theme ?? 'default',
          params.look ?? 'classic',
          params.effectiveBackground,
          params.effectivePadding,
          params.scale,
          params.width ?? 0,
          params.height ?? 0,
        ])
      )
      .digest('hex');
  }

  /**
   * Retrieve an item from the LRU cache and mark it most-recently-used
   */
  private getCachedResult(key: string): CachedPngEntry | undefined {
    const hit = this.cache.get(key);
    if (!hit) return undefined;

    this.cache.delete(key);
    this.cache.set(key, hit);
    return hit;
  }

  /**
   * Insert a PNG render result into the byte-bounded LRU cache
   */
  private setCachedResult(key: string, entry: CachedPngEntry): void {
    const entryBytes = entry.pngBuffer.length;
    if (entryBytes > Math.floor(this.maxCacheBytes / 2)) {
      return;
    }

    const existing = this.cache.get(key);
    if (existing) {
      this.totalCacheBytes -= existing.pngBuffer.length;
      this.cache.delete(key);
    }

    while (
      this.cache.size >= this.maxCacheEntries ||
      this.totalCacheBytes + entryBytes > this.maxCacheBytes
    ) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey === undefined) break;
      const oldest = this.cache.get(oldestKey);
      if (oldest) {
        this.totalCacheBytes -= oldest.pngBuffer.length;
      }
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);
    this.totalCacheBytes += entryBytes;
  }

  /**
   * Write PNG bytes to disk when outputPath is specified
   */
  private async writeOutputFile(outputPath: string | undefined, buffer: Buffer): Promise<string | undefined> {
    if (!outputPath) return undefined;
    const resolvedOutputPath = path.resolve(outputPath);
    await fs.promises.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
    await fs.promises.writeFile(resolvedOutputPath, buffer);
    return resolvedOutputPath;
  }

  /**
   * Apply viewport updates only when dimensions or DPI scale changed
   */
  private async ensureViewport(pooled: PooledPage, target: ViewportConfig): Promise<void> {
    const prev = pooled.lastViewport;
    if (
      prev.width === target.width &&
      prev.height === target.height &&
      prev.deviceScaleFactor === target.deviceScaleFactor
    ) {
      return;
    }
    await pooled.page.setViewport(target);
    pooled.lastViewport = target;
  }

  /**
   * Execute Mermaid parsing, SVG rendering, and container screenshot on a warm page
   */
  private async performRenderOnPage(
    pooled: PooledPage,
    params: {
      effectiveSyntax: string;
      theme?: Theme;
      look?: Look;
      bodyBgColor: string;
      isTransparent: boolean;
      effectivePadding: number;
      scale: number;
      width?: number;
      height?: number;
    }
  ): Promise<
    | { ok: true; buffer: Buffer; width: number; height: number }
    | { ok: false; error: any }
  > {
    const {
      effectiveSyntax,
      theme,
      look,
      bodyBgColor,
      isTransparent,
      effectivePadding,
      scale,
      width,
      height,
    } = params;

    const initViewportWidth = width ? Math.max(100, Math.floor(width)) : 1200;
    const initViewportHeight = height ? Math.max(100, Math.floor(height)) : 800;

    await this.ensureViewport(pooled, {
      width: initViewportWidth,
      height: initViewportHeight,
      deviceScaleFactor: scale,
    });

    const evalResult = await pooled.page.evaluate(
      async (
        syntax: string,
        bgColor: string,
        paddingPx: number,
        activeTheme?: string,
        activeLook?: string,
        reqWidth?: number,
        reqHeight?: number
      ) => {
        const container = document.getElementById('container');
        if (!container) {
          return { success: false, error: { message: 'Container element not found.' } };
        }

        // Apply per-render container background and configurable padding
        document.body.style.backgroundColor = bgColor;
        container.style.backgroundColor = bgColor;
        container.style.padding = `${paddingPx}px`;
        container.innerHTML = '';
        for (const child of Array.from(document.body.children)) {
          if (child.id !== 'container') child.remove();
        }

        const mermaidObj = (window as any).mermaid;
        if (!mermaidObj) {
          return {
            success: false,
            error: { message: 'Mermaid library failed to load in the browser window.' },
          };
        }

        try {
          if (mermaidObj.mermaidAPI && typeof mermaidObj.mermaidAPI.reset === 'function') {
            mermaidObj.mermaidAPI.reset();
          }

          mermaidObj.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: activeTheme || 'default',
            look: activeLook || 'classic',
            maxTextSize: 200000,
            maxEdges: 2000,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          });
        } catch (initErr: any) {
          return {
            success: false,
            error: { message: `Mermaid initialize failed: ${initErr?.message || initErr}` },
          };
        }

        // 1. Pre-validation with parse() for precise line/column errors
        try {
          if (typeof mermaidObj.parse === 'function') {
            await mermaidObj.parse(syntax);
          }
        } catch (parseErr: any) {
          for (const child of Array.from(document.body.children)) {
            if (child.id !== 'container') child.remove();
          }
          return {
            success: false,
            error: {
              message: parseErr?.message || parseErr?.str || String(parseErr),
              str: parseErr?.str,
              hash: parseErr?.hash,
            },
          };
        }

        // 2. Render SVG
        try {
          const diagramId = 'mermaid-render-' + Math.random().toString(36).substring(2, 9);
          const renderOutput = await mermaidObj.render(diagramId, syntax);
          const svgString = typeof renderOutput === 'string' ? renderOutput : renderOutput.svg;

          container.innerHTML = svgString;
          const svgElement = container.querySelector('svg');
          if (!svgElement) {
            return { success: false, error: { message: 'Rendered SVG element not found.' } };
          }

          // Extract natural diagram dimensions from SVG
          let naturalWidth = 0;
          let naturalHeight = 0;

          if (svgElement.style.maxWidth) {
            naturalWidth = parseFloat(svgElement.style.maxWidth);
          }

          const vb = svgElement.viewBox ? svgElement.viewBox.baseVal : null;
          if (vb && vb.width > 0 && vb.height > 0) {
            if (!naturalWidth || naturalWidth <= 0) {
              naturalWidth = vb.width;
            }
            naturalHeight = vb.height * (naturalWidth / vb.width);
          } else if (!naturalHeight) {
            const bBox = svgElement.getBBox ? svgElement.getBBox() : null;
            if (bBox && bBox.height > 0) {
              naturalHeight = bBox.height;
              if (!naturalWidth || naturalWidth <= 0) {
                naturalWidth = bBox.width;
              }
            }
          }

          // Determine target layout dimensions (honoring explicit width/height if requested)
          let targetWidth = naturalWidth;
          let targetHeight = naturalHeight;

          if (reqWidth && reqWidth > 0) {
            targetWidth = reqWidth;
            if (naturalWidth > 0 && naturalHeight > 0) {
              targetHeight = naturalHeight * (reqWidth / naturalWidth);
            } else if (reqHeight && reqHeight > 0) {
              targetHeight = reqHeight;
            }
          } else if (reqHeight && reqHeight > 0 && naturalHeight > 0) {
            targetHeight = reqHeight;
            if (naturalWidth > 0) {
              targetWidth = naturalWidth * (reqHeight / naturalHeight);
            }
          }

          // Fix intrinsic sizing bug:
          // Override SVG width/height and remove percentage width so it doesn't collapse to 300px
          if (targetWidth > 0) {
            svgElement.style.width = targetWidth + 'px';
            svgElement.style.maxWidth = 'none';
            svgElement.removeAttribute('width');
          }
          if (targetHeight > 0) {
            svgElement.style.height = targetHeight + 'px';
            svgElement.removeAttribute('height');
          }

          const containerRect = container.getBoundingClientRect();
          return {
            success: true,
            width: Math.ceil(containerRect.width),
            height: Math.ceil(containerRect.height),
          };
        } catch (renderErr: any) {
          return {
            success: false,
            error: {
              message: renderErr?.message || renderErr?.str || String(renderErr),
              str: renderErr?.str,
              hash: renderErr?.hash,
            },
          };
        } finally {
          for (const child of Array.from(document.body.children)) {
            if (child.id !== 'container') child.remove();
          }
        }
      },
      effectiveSyntax,
      bodyBgColor,
      effectivePadding,
      theme,
      look,
      width,
      height
    );

    if (!evalResult.success) {
      return { ok: false, error: evalResult.error };
    }

    const measuredWidth = evalResult.width || 800;
    const measuredHeight = evalResult.height || 600;

    // Expand viewport only when the padded container exceeds the active viewport
    const neededViewportWidth = Math.max(initViewportWidth, Math.ceil(measuredWidth + 8));
    const neededViewportHeight = Math.max(initViewportHeight, Math.ceil(measuredHeight + 8));

    if (
      neededViewportWidth > pooled.lastViewport.width ||
      neededViewportHeight > pooled.lastViewport.height
    ) {
      await this.ensureViewport(pooled, {
        width: neededViewportWidth,
        height: neededViewportHeight,
        deviceScaleFactor: scale,
      });
    }

    const containerElement = await pooled.page.$('#container');
    if (!containerElement) {
      throw new Error('Failed to locate diagram container element for screenshot.');
    }

    const screenshotBuffer = (await containerElement.screenshot({
      type: 'png',
      omitBackground: isTransparent,
    })) as Buffer;

    return {
      ok: true,
      buffer: screenshotBuffer,
      width: measuredWidth,
      height: measuredHeight,
    };
  }

  /**
   * Render Mermaid syntax into PNG
   */
  public async renderToPng(options: RenderOptions): Promise<RenderResult> {
    const startTime = performance.now();
    const {
      mermaidSyntax,
      diagramType,
      outputPath,
      theme,
      look,
      background,
      padding,
      scale = 2,
      width,
      height,
    } = options;

    const effectiveBackground = resolveEffectiveBackground(theme, background);
    const effectivePadding = resolveEffectivePadding(padding);
    const effectiveSyntax = normalizeSyntaxHeader(mermaidSyntax, diagramType);

    // 1. Check in-memory LRU cache first
    const cacheKey = this.buildCacheKey({
      effectiveSyntax,
      theme,
      look,
      effectiveBackground,
      effectivePadding,
      scale,
      width,
      height,
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      const resolvedOutputPath = await this.writeOutputFile(outputPath, cached.pngBuffer);
      return {
        success: true,
        pngBuffer: cached.pngBuffer,
        base64Png: cached.base64Png,
        outputPath: resolvedOutputPath,
        width: cached.width,
        height: cached.height,
        padding: cached.padding,
        renderTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        cacheHit: true,
      };
    }

    const isTransparent = effectiveBackground.toLowerCase() === 'transparent';
    const bodyBgColor = isTransparent ? 'transparent' : effectiveBackground;

    // 2. Acquire pooled warm page
    const { entry: pooled, generation: acquiredGen } = await this.acquirePage();

    try {
      let timeoutTimer: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutTimer = setTimeout(() => {
          pooled.tainted = true;
          reject(new Error(`Mermaid rendering timed out after ${this.renderTimeoutMs}ms.`));
        }, this.renderTimeoutMs);
        if (timeoutTimer.unref) {
          timeoutTimer.unref();
        }
      });

      const renderOutcome = await Promise.race([
        this.performRenderOnPage(pooled, {
          effectiveSyntax,
          theme,
          look,
          bodyBgColor,
          isTransparent,
          effectivePadding,
          scale,
          width,
          height,
        }),
        timeoutPromise,
      ]).finally(() => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }
      });

      pooled.renderCount++;

      if (!renderOutcome.ok) {
        const diagnostics = buildDiagnosticReport(effectiveSyntax, renderOutcome.error);
        return {
          success: false,
          renderTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
          cacheHit: false,
          diagnostics,
        };
      }

      const base64Png = renderOutcome.buffer.toString('base64');
      this.setCachedResult(cacheKey, {
        pngBuffer: renderOutcome.buffer,
        base64Png,
        width: renderOutcome.width,
        height: renderOutcome.height,
        padding: effectivePadding,
      });

      const resolvedOutputPath = await this.writeOutputFile(outputPath, renderOutcome.buffer);
      this.resetIdleTimer();

      return {
        success: true,
        pngBuffer: renderOutcome.buffer,
        base64Png,
        outputPath: resolvedOutputPath,
        width: renderOutcome.width,
        height: renderOutcome.height,
        padding: effectivePadding,
        renderTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        cacheHit: false,
      };
    } catch (fatalErr: any) {
      pooled.tainted = true;
      const diagnostics = buildDiagnosticReport(effectiveSyntax, fatalErr);
      return {
        success: false,
        renderTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
        cacheHit: false,
        diagnostics,
      };
    } finally {
      this.releasePage(pooled, acquiredGen);
    }
  }
}
