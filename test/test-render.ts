import fs from 'node:fs';
import path from 'node:path';
import { MermaidRenderer } from '../src/renderer.js';
import { DIAGRAM_CATALOG, getDiagramSyntaxGuide } from '../src/catalog.js';
import { buildDiagnosticReport } from '../src/diagnostics.js';
import { resolveEffectiveBackground, DARK_THEMES } from '../src/types.js';

async function runTests() {
  console.log('🧪 Starting Mermaid MCP Renderer Tests...\n');

  const renderer = new MermaidRenderer(1);
  const outputDir = path.resolve('test/output');
  await fs.promises.mkdir(outputDir, { recursive: true });

  let testsPassed = 0;
  let testsTotal = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    testsTotal++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    }
  }

  // --- Test 1: Flowchart Diagram ---
  console.log('1. Testing Flowchart rendering...');
  const flowchartSyntax = `graph TD
    A[User Request] --> B{Is Valid?}
    B -->|Yes| C[Render Diagram]
    B -->|No| D[Return Error Diagnostics]
    C --> E[PNG Output]`;

  const flowchartOutput = path.join(outputDir, 'flowchart.png');
  const res1 = await renderer.renderToPng({
    mermaidSyntax: flowchartSyntax,
    outputPath: flowchartOutput,
    theme: 'default',
    scale: 2,
  });

  assert(res1.success === true, 'Flowchart renders successfully');
  assert(!!res1.pngBuffer && res1.pngBuffer.length > 1000, 'PNG buffer is generated and non-empty');
  assert(
    !!res1.pngBuffer &&
      res1.pngBuffer[0] === 0x89 &&
      res1.pngBuffer[1] === 0x50 &&
      res1.pngBuffer[2] === 0x4e &&
      res1.pngBuffer[3] === 0x47,
    'PNG header magic bytes are valid (0x89504E47)'
  );
  assert(fs.existsSync(flowchartOutput), 'Output PNG file was written to disk');
  assert(typeof res1.width === 'number' && res1.width > 0, `Width is measured (${res1.width}px)`);
  assert(typeof res1.height === 'number' && res1.height > 0, `Height is measured (${res1.height}px)`);

  // --- Test 2: Sequence Diagram with Dark Theme & Custom Background ---
  console.log('\n2. Testing Sequence diagram with Dark theme...');
  const sequenceSyntax = `sequenceDiagram
    autonumber
    actor Client as AI Client
    participant Server as MCP Server
    participant Engine as Mermaid v12
    Client->>Server: render_mermaid_to_png(syntax)
    Server->>Engine: parse() and render()
    Engine-->>Server: SVG & Dimensions
    Server-->>Client: PNG Image & Dimensions`;

  const sequenceOutput = path.join(outputDir, 'sequence-dark.png');
  const res2 = await renderer.renderToPng({
    mermaidSyntax: sequenceSyntax,
    outputPath: sequenceOutput,
    theme: 'dark',
    background: '#1e1e2e',
    scale: 2,
  });

  assert(res2.success === true, 'Sequence diagram renders successfully with dark theme');
  assert(fs.existsSync(sequenceOutput), 'Sequence PNG file written to disk');

  // --- Test 3: Local .mmd file rendering ---
  console.log('\n3. Testing Local .mmd file rendering...');
  const sampleMmdPath = path.join(outputDir, 'sample.mmd');
  const samplePngPath = path.join(outputDir, 'sample-file-output.png');
  await fs.promises.writeFile(
    sampleMmdPath,
    `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +bark()
    }
    Animal <|-- Dog`
  );

  const fileSyntax = await fs.promises.readFile(sampleMmdPath, 'utf8');
  const res3 = await renderer.renderToPng({
    mermaidSyntax: fileSyntax,
    outputPath: samplePngPath,
    theme: 'forest',
  });

  assert(res3.success === true, 'Class diagram from file renders successfully');
  assert(fs.existsSync(samplePngPath), 'Output PNG file from .mmd written to disk');

  // --- Test 4: Verbose Error Diagnostic on Invalid Syntax ---
  console.log('\n4. Testing Verbose AI Error Diagnostics on broken syntax...');
  const brokenSyntax = `graph TD
    A[Start] --> B(Valid Step)
    B -- invalid label syntax -- C
    C --> D[End]`;

  const res4 = await renderer.renderToPng({
    mermaidSyntax: brokenSyntax,
  });

  assert(res4.success === false, 'Broken syntax correctly reports success = false');
  assert(!!res4.diagnostics, 'Diagnostic report is generated');
  assert(res4.diagnostics?.line === 3, `Correct error line identified (Line ${res4.diagnostics?.line})`);
  assert(
    !!res4.diagnostics?.codeFrame && res4.diagnostics.codeFrame.includes('>   3 |'),
    'Code frame highlights line 3'
  );
  assert(
    !!res4.diagnostics?.hint && res4.diagnostics.hint.includes('pipes'),
    'Hint provides flowchart-specific remediation'
  );

  console.log('\n--- Sample Formatted Diagnostic Report Output ---');
  console.log(res4.diagnostics?.formattedMarkdown);
  console.log('-------------------------------------------------\n');

  // --- Test 5: Wide Diagram High-Resolution Rendering (>300px) ---
  console.log('\n5. Testing Wide Diagram High-Resolution Rendering (>1000px)...');
  const wideSyntax = `graph LR
    A[Step 1: Ingestion] --> B[Step 2: Validation] --> C[Step 3: Processing] --> D[Step 4: Storage] --> E[Step 5: Notification] --> F[Step 6: Complete]`;

  const wideOutput = path.join(outputDir, 'wide-flowchart.png');
  const res5 = await renderer.renderToPng({
    mermaidSyntax: wideSyntax,
    outputPath: wideOutput,
    scale: 2,
  });

  assert(res5.success === true, 'Wide flowchart renders successfully');
  assert(typeof res5.width === 'number' && res5.width > 800, `Natural width is preserved (${res5.width}px > 800px, not clamped to 300px)`);
  if (res5.pngBuffer) {
    const physW = res5.pngBuffer.readUInt32BE(16);
    const physH = res5.pngBuffer.readUInt32BE(20);
    assert(physW >= 1600, `Physical PNG width is sharp retina resolution (${physW}px >= 1600px at 2x scale)`);
  }

  // --- Test 6: Modern Theme (redux-color) & Look (neo) ---
  console.log('\n6. Testing Modern Theme (redux-color) with Neo Look...');
  const neoSyntax = `flowchart LR
    A[Start] --> B{Process}
    B -->|Option 1| C[Redux Result]
    B -->|Option 2| D[Alternative]`;

  const neoOutput = path.join(outputDir, 'neo-redux-color.png');
  const res6 = await renderer.renderToPng({
    mermaidSyntax: neoSyntax,
    outputPath: neoOutput,
    theme: 'redux-color',
    look: 'neo',
    scale: 2,
  });

  assert(res6.success === true, 'Diagram renders successfully with redux-color theme and neo look');
  assert(fs.existsSync(neoOutput), 'Neo look PNG file written to disk');

  // --- Test 7: Hand-Drawn Look ---
  console.log('\n7. Testing Hand-Drawn Look (RoughJS style)...');
  const handDrawnOutput = path.join(outputDir, 'hand-drawn.png');
  const res7 = await renderer.renderToPng({
    mermaidSyntax: neoSyntax,
    outputPath: handDrawnOutput,
    look: 'handDrawn',
    scale: 2,
  });

  assert(res7.success === true, 'Diagram renders successfully with handDrawn look');
  assert(fs.existsSync(handDrawnOutput), 'Hand-drawn look PNG file written to disk');

  // --- Test 8: Enhancement 1 - 100% SyntaxGuide Coverage Across All 40 Catalog Entries ---
  console.log('\n8. Testing 100% SyntaxGuide coverage across all 40 DIAGRAM_CATALOG entries...');
  let missingGuides: string[] = [];
  for (const entry of DIAGRAM_CATALOG) {
    const guideRes = getDiagramSyntaxGuide(entry.canonicalKeyword);
    const hasAllSections =
      guideRes.success &&
      guideRes.content.includes('## Core Syntax Elements') &&
      guideRes.content.includes('## Common Pitfalls & Mistakes to Avoid') &&
      guideRes.content.includes('## Minimal Working Example') &&
      guideRes.content.includes('## Complete Real-World Example') &&
      !guideRes.content.includes('## Starter Example');
    if (!hasAllSections) {
      missingGuides.push(entry.canonicalKeyword);
    }
  }
  assert(
    missingGuides.length === 0,
    `All ${DIAGRAM_CATALOG.length} catalog diagram types have full SyntaxGuide objects (missing: ${missingGuides.join(', ') || 'none'})`
  );

  // --- Test 9: Enhancement 1 - Frontmatter-Aware Diagnostics & Diagram-Specific Hints ---
  console.log('\n9. Testing frontmatter-aware diagram detection & expanded diagnostic hints...');
  const frontmatterBrokenSankey = `---
title: Energy Flow
---
%% Leading comment
sankey-beta
A --> B`;
  const diagSankey = buildDiagnosticReport(frontmatterBrokenSankey, 'Parse error on line 6: Expecting CSV');
  assert(
    diagSankey.hint.includes('CSV') && diagSankey.hint.includes('sankey-beta'),
    'detectDiagramType skips YAML frontmatter & comments and returns sankey-beta hint'
  );

  const diagRadar = buildDiagnosticReport('radar-beta\n  axis A\n  curve c1[10]', 'Parse error on line 3');
  assert(
    diagRadar.hint.includes('curly braces'),
    'getHintForDiagram returns radar-beta specific hint'
  );

  const diagPeg = buildDiagnosticReport('railroad-peg-beta\n  Expr = Term', 'Parse error on line 2');
  assert(
    diagPeg.hint.includes('<-'),
    'getHintForDiagram returns railroad-peg-beta specific hint'
  );

  // --- Test 10: Enhancement 2 - Smart Dark-Theme Background Pairing ---
  console.log('\n10. Testing Smart Dark-Theme Background Pairing...');
  for (const darkTheme of DARK_THEMES) {
    assert(
      resolveEffectiveBackground(darkTheme, undefined) === '#1e1e2e',
      `resolveEffectiveBackground('${darkTheme}', undefined) defaults to '#1e1e2e'`
    );
    assert(
      resolveEffectiveBackground(darkTheme, 'transparent') === 'transparent',
      `resolveEffectiveBackground('${darkTheme}', 'transparent') honors explicit override`
    );
  }
  assert(
    resolveEffectiveBackground('default', undefined) === 'white',
    `resolveEffectiveBackground('default', undefined) defaults to 'white'`
  );
  assert(
    resolveEffectiveBackground('neo', undefined) === 'white',
    `resolveEffectiveBackground('neo', undefined) defaults to 'white'`
  );

  const autoDarkOutput = path.join(outputDir, 'auto-dark-bg.png');
  const resAutoDark = await renderer.renderToPng({
    mermaidSyntax: flowchartSyntax,
    outputPath: autoDarkOutput,
    theme: 'redux-dark',
    scale: 1,
  });
  assert(resAutoDark.success === true, 'redux-dark theme renders with omitted background');

  // --- Test 11: Warm Pool State Isolation (no theme/look leakage across renders) ---
  console.log('\n11. Testing Warm Pool State Isolation across sequential renders...');
  const isolatedBaseline = await renderer.renderToPng({
    mermaidSyntax: `flowchart LR\n  X[Alpha] --> Y[Beta]`,
    scale: 2,
  });
  const styledRender = await renderer.renderToPng({
    mermaidSyntax: `flowchart LR\n  X[Alpha] --> Y[Gamma]`,
    theme: 'dark',
    look: 'handDrawn',
    scale: 2,
  });
  const afterStyledOmitted = await renderer.renderToPng({
    mermaidSyntax: `flowchart LR\n  X[Alpha] --> Y[Delta]`,
    scale: 2,
  });
  assert(
    isolatedBaseline.success && styledRender.success && afterStyledOmitted.success,
    'Sequential dark+handDrawn and omitted-default renders succeed'
  );
  // Compare against a fresh renderer's default+classic render of the same syntax to prove zero state leak
  const freshRenderer = new MermaidRenderer(1);
  const freshDefaultCheck = await freshRenderer.renderToPng({
    mermaidSyntax: `flowchart LR\n  X[Alpha] --> Y[Delta]`,
    scale: 2,
  });
  assert(
    !!afterStyledOmitted.pngBuffer &&
      !!freshDefaultCheck.pngBuffer &&
      afterStyledOmitted.pngBuffer.equals(freshDefaultCheck.pngBuffer),
    'Warm page resets theme/look cleanly after dark+handDrawn render (exact byte match to clean page)'
  );
  await freshRenderer.close();

  // --- Test 12: Bounded Dynamic Pool & Concurrency Safety ---
  console.log('\n12. Testing Bounded Dynamic Pool under parallel render burst...');
  const concurrentRenderer = new MermaidRenderer(1);
  const concurrentTasks = [1, 2, 3, 4].map((idx) =>
    concurrentRenderer.renderToPng({
      mermaidSyntax: `flowchart TD\n  N${idx}[Concurrent Node ${idx}] --> D${idx}[Done ${idx}]`,
      diagramType: 'flowchart',
      scale: 1,
    })
  );
  const concurrentResults = await Promise.all(concurrentTasks);
  const concurrentStats = concurrentRenderer.getPoolStats();
  assert(
    concurrentResults.every((r) => r.success && !!r.pngBuffer && r.pngBuffer.length > 500),
    'All 4 concurrent renders succeed without launch or DOM races'
  );
  assert(
    concurrentStats.poolSize >= 2 && concurrentStats.poolSize <= 3 && concurrentStats.inUseCount === 0,
    `Bounded pool scaled cleanly within 2..3 pages and returned all pages idle (poolSize=${concurrentStats.poolSize}, inUse=${concurrentStats.inUseCount})`
  );
  await concurrentRenderer.close();

  // --- Test 13: LRU Cache Hits & Disk Write on Cache Hit ---
  console.log('\n13. Testing Byte-Bounded LRU Render Cache...');
  const cacheSyntax = `flowchart LR\n  CacheA[Input] --> CacheB[Output]`;
  const missRes = await renderer.renderToPng({
    mermaidSyntax: cacheSyntax,
    scale: 2,
  });
  const cachedDiskPath = path.join(outputDir, 'cached-hit-output.png');
  if (fs.existsSync(cachedDiskPath)) {
    fs.unlinkSync(cachedDiskPath);
  }
  const hitRes = await renderer.renderToPng({
    mermaidSyntax: cacheSyntax,
    outputPath: cachedDiskPath,
    scale: 2,
  });
  assert(missRes.success && missRes.cacheHit === false, 'First render recorded cacheHit=false');
  assert(hitRes.success && hitRes.cacheHit === true, 'Second identical render recorded cacheHit=true');
  assert(
    fs.existsSync(cachedDiskPath) && !!missRes.pngBuffer && !!hitRes.pngBuffer && missRes.pngBuffer.equals(hitRes.pngBuffer),
    'Cache hit wrote identical PNG buffer to disk at new outputPath'
  );

  // --- Test 14: Configurable Canvas Padding ---
  console.log('\n14. Testing Configurable Canvas Padding (0px vs 48px)...');
  const padSyntax = `flowchart LR\n  P1[Pad Test] --> P2[End]`;
  const pad0Res = await renderer.renderToPng({
    mermaidSyntax: padSyntax,
    padding: 0,
    scale: 2,
  });
  const pad48Res = await renderer.renderToPng({
    mermaidSyntax: padSyntax,
    padding: 48,
    scale: 2,
  });
  assert(
    pad0Res.success && pad48Res.success && pad0Res.padding === 0 && pad48Res.padding === 48,
    'Configurable padding (0px and 48px) renders successfully and records padding metadata'
  );
  if (pad0Res.pngBuffer && pad48Res.pngBuffer) {
    const w0 = pad0Res.pngBuffer.readUInt32BE(16);
    const h0 = pad0Res.pngBuffer.readUInt32BE(20);
    const w48 = pad48Res.pngBuffer.readUInt32BE(16);
    const h48 = pad48Res.pngBuffer.readUInt32BE(20);
    assert(
      w48 - w0 === 96 * 2 && h48 - h0 === 96 * 2,
      `Physical PNG dimensions grew cleanly by 2*(48-0)*2 = 192px (${w0}x${h0} -> ${w48}x${h48})`
    );
  }

  // --- Test 15: HTTP/S Request Blocking & Raised maxEdges (550 edges) ---
  console.log('\n15. Testing HTTP/S Request Blocking & Large Diagram Limits (>500 edges)...');
  const blockedNetStart = performance.now();
  const netBlockedRes = await renderer.renderToPng({
    mermaidSyntax: `flowchart LR\n  A["<img src='https://127.0.0.1:1/hang.png' width='20' height='20'/> Local HTML Label"] --> B[Fast]`,
    scale: 1,
  });
  const blockedNetElapsed = performance.now() - blockedNetStart;
  assert(
    netBlockedRes.success === true && blockedNetElapsed < 3000,
    `Diagram with external URL finishes rapidly without hanging (${Math.round(blockedNetElapsed)}ms)`
  );

  // Build a 550-edge flowchart (> default 500 cap, well within raised 2,000 cap)
  const edgeLines = ['flowchart LR'];
  for (let i = 0; i < 550; i++) {
    edgeLines.push(`  N${i % 40} --> N${(i % 40) + 1}`);
  }
  const largeEdgesRes = await renderer.renderToPng({
    mermaidSyntax: edgeLines.join('\n'),
    scale: 1,
  });
  assert(
    largeEdgesRes.success === true,
    `550-edge diagram renders successfully using raised maxEdges=2000 limit (time=${largeEdgesRes.renderTimeMs}ms)`
  );

  const edgeLimitDiag = buildDiagnosticReport('flowchart LR\nA-->B', 'Maximum edges exceeded');
  assert(
    edgeLimitDiag.hint.includes('2,000'),
    'Diagnostic hint reflects raised 2,000-edge limit when exceeded'
  );

  // Clean up
  await renderer.close();

  console.log(`\nResults: ${testsPassed}/${testsTotal} tests passed.`);
  if (testsPassed !== testsTotal) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
