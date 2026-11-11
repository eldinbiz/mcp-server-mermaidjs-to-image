import fs from 'node:fs';
import path from 'node:path';
import { MermaidRenderer } from '../src/renderer.js';

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
