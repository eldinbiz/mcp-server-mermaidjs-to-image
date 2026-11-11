import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import puppeteer, { Browser, Page } from 'puppeteer';
import { RenderResult, Theme } from './types.js';
import { buildDiagnosticReport } from './diagnostics.js';

const require = createRequire(import.meta.url);

export interface RenderOptions {
  mermaidSyntax: string;
  diagramType?: string;
  outputPath?: string;
  theme?: Theme;
  background?: string;
  scale?: number;
  width?: number;
  height?: number;
}

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
  private idleTimer: NodeJS.Timeout | null = null;
  private readonly idleTimeoutMs: number = 5 * 60 * 1000; // 5 minutes
  private mermaidScript: string | null = null;

  constructor(idleTimeoutMinutes: number = 5) {
    this.idleTimeoutMs = idleTimeoutMinutes * 60 * 1000;
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
   * Get or launch the headless browser singleton
   */
  public async getBrowser(): Promise<Browser> {
    this.resetIdleTimer();

    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ];

    try {
      // First attempt: default puppeteer launch (bundled browser)
      this.browser = await puppeteer.launch({
        headless: true,
        args: launchArgs,
      });
    } catch (primaryErr: any) {
      // Fallback: system-installed Chrome or Edge
      const fallbackExecutable = this.findSystemExecutable();
      if (!fallbackExecutable) {
        throw new Error(
          `Failed to launch bundled Chromium and no system Chrome/Edge was found. Details: ${primaryErr.message}`
        );
      }

      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: fallbackExecutable,
        args: launchArgs,
      });
    }

    this.browser.on('disconnected', () => {
      this.browser = null;
    });

    return this.browser;
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
   * Close the browser instance immediately and release all resources
   */
  public async close(): Promise<void> {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    if (this.browser) {
      try {
        await this.browser.close();
      } catch {
        // ignore errors during shutdown
      }
      this.browser = null;
    }
  }

  /**
   * Render Mermaid syntax into PNG
   */
  public async renderToPng(options: RenderOptions): Promise<RenderResult> {
    const {
      mermaidSyntax,
      diagramType,
      outputPath,
      theme = 'default',
      background = 'white',
      scale = 2,
      width = 1200,
      height = 800,
    } = options;

    const effectiveSyntax = normalizeSyntaxHeader(mermaidSyntax, diagramType);

    const browser = await this.getBrowser();
    let page: Page | null = null;

    try {
      page = await browser.newPage();

      // Configure viewport with requested DPI scale
      await page.setViewport({
        width: Math.max(100, Math.floor(width)),
        height: Math.max(100, Math.floor(height)),
        deviceScaleFactor: scale,
      });

      const isTransparent = background.toLowerCase() === 'transparent';
      const bodyBgColor = isTransparent ? 'transparent' : background;

      // Prepare basic HTML scaffold
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 24px;
      background-color: ${bodyBgColor};
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #container {
      display: inline-block;
      padding: 0;
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="container"></div>
</body>
</html>`;

      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      // Inject Mermaid.js
      const scriptContent = this.getMermaidScript();
      await page.addScriptTag({ content: scriptContent });

      // Evaluate parsing and rendering in the browser context
      const evalResult = await page.evaluate(
        async (syntax: string, activeTheme: string) => {
          const mermaidObj = (window as any).mermaid;
          if (!mermaidObj) {
            return {
              success: false,
              error: { message: 'Mermaid library failed to load in the browser window.' },
            };
          }

          try {
            mermaidObj.initialize({
              startOnLoad: false,
              theme: activeTheme,
              securityLevel: 'loose',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            });
          } catch (initErr: any) {
            return {
              success: false,
              error: { message: `Mermaid initialize failed: ${initErr?.message || initErr}` },
            };
          }

          // 1. Pre-validation with parse()
          try {
            if (typeof mermaidObj.parse === 'function') {
              await mermaidObj.parse(syntax);
            }
          } catch (parseErr: any) {
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

            const container = document.getElementById('container');
            if (!container) {
              return { success: false, error: { message: 'Container element not found.' } };
            }
            container.innerHTML = svgString;

            const svgElement = container.querySelector('svg');
            if (!svgElement) {
              return { success: false, error: { message: 'Rendered SVG element not found.' } };
            }

            const rect = svgElement.getBoundingClientRect();
            return {
              success: true,
              width: Math.ceil(rect.width),
              height: Math.ceil(rect.height),
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
          }
        },
        effectiveSyntax,
        theme
      );

      if (!evalResult.success) {
        const diagnostics = buildDiagnosticReport(effectiveSyntax, evalResult.error);
        return {
          success: false,
          diagnostics,
        };
      }

      // Take screenshot of the diagram container
      const containerElement = await page.$('#container');
      if (!containerElement) {
        throw new Error('Failed to locate diagram container element for screenshot.');
      }

      const screenshotBuffer = (await containerElement.screenshot({
        type: 'png',
        omitBackground: isTransparent,
      })) as Buffer;

      // Save to disk if output path is requested
      let resolvedOutputPath: string | undefined;
      if (outputPath) {
        resolvedOutputPath = path.resolve(outputPath);
        await fs.promises.mkdir(path.dirname(resolvedOutputPath), { recursive: true });
        await fs.promises.writeFile(resolvedOutputPath, screenshotBuffer);
      }

      this.resetIdleTimer();

      return {
        success: true,
        pngBuffer: screenshotBuffer,
        base64Png: screenshotBuffer.toString('base64'),
        outputPath: resolvedOutputPath,
        width: evalResult.width,
        height: evalResult.height,
      };
    } catch (fatalErr: any) {
      const diagnostics = buildDiagnosticReport(effectiveSyntax, fatalErr);
      return {
        success: false,
        diagnostics,
      };
    } finally {
      if (page) {
        try {
          await page.close();
        } catch {
          // ignore page close errors
        }
      }
    }
  }
}
