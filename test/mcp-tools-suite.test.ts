import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function runTestSuite() {
  console.log('🧪 Starting MCP Tools Test Suite...');

  const serverScript = path.resolve('dist/index.js');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverScript],
  });

  const client = new Client(
    { name: 'mcp-test-runner', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP Server via Stdio Transport.');

  // Test 1: List all tools
  console.log('\n--- Test 1: List Tools ---');
  const toolsResponse = await client.listTools();
  const toolNames = toolsResponse.tools.map((t) => t.name);
  console.log('Available tools:', toolNames);
  if (
    !toolNames.includes('get_supported_diagrams') ||
    !toolNames.includes('get_diagram_syntax_guide') ||
    !toolNames.includes('render_mermaid_to_png') ||
    !toolNames.includes('render_mermaid_file')
  ) {
    throw new Error('Missing expected tools in listTools response!');
  }
  console.log('✅ Test 1 Passed: All 4 tools registered.');

  // Test 2: get_supported_diagrams
  console.log('\n--- Test 2: get_supported_diagrams ---');
  const supportedResult = (await client.callTool({
    name: 'get_supported_diagrams',
    arguments: {},
  })) as any;

  const catalogText = supportedResult.content?.[0]?.text || '';
  if (!catalogText.includes('v12.3.0') || !catalogText.includes('usecase-beta') || !catalogText.includes('swimlane-beta')) {
    throw new Error('get_supported_diagrams output missing expected version or keywords!');
  }
  console.log('✅ Test 2 Passed: get_supported_diagrams returned engine version & catalog.');

  // Test 3: get_diagram_syntax_guide for usecase-beta
  console.log('\n--- Test 3: get_diagram_syntax_guide (usecase-beta) ---');
  const guideResult = (await client.callTool({
    name: 'get_diagram_syntax_guide',
    arguments: { diagram_type: 'usecase-beta' },
  })) as any;

  const guideText = guideResult.content?.[0]?.text || '';
  if (!guideText.includes('systemBoundary') || !guideText.includes(':include') || !guideText.includes('actor')) {
    throw new Error('get_diagram_syntax_guide output missing usecase syntax rules!');
  }
  console.log('✅ Test 3 Passed: get_diagram_syntax_guide returned detailed grammar rules and examples.');

  // Test 4: Rejection when diagram_type is invalid
  console.log('\n--- Test 4: Rejection on Invalid diagram_type ---');
  const rejectResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'invalid_type_123',
      mermaid_syntax: 'graph TD; A-->B;',
    },
  })) as any;

  if (!rejectResult.isError) {
    throw new Error('Expected render_mermaid_to_png to reject invalid diagram_type, but it succeeded!');
  }
  const rejectMsg = rejectResult.content?.[0]?.text || '';
  if (!rejectMsg.includes('Mandatory Diagram Type Missing or Invalid') || !rejectMsg.includes('Available Keywords')) {
    throw new Error('Rejection feedback message missing keyword list or explanation!');
  }
  console.log('✅ Test 4 Passed: Properly rejected invalid diagram_type and returned keyword feedback.');

  // Test 5: Render with valid usecase-beta (using alias 'usecase')
  console.log('\n--- Test 5: Render Use-Case Diagram with Alias Normalization ---');
  const useCaseSyntax = `usecase-beta
direction LR

actor Customer("Customer")
actor Admin("Store Admin")

systemBoundary "Online Store"
  Browse("Browse Catalog")
  Checkout("Checkout")
  Payment("Process Payment")
end

Customer --> Browse
Customer --> Checkout
Admin --> Browse

Checkout ..> :include Payment`;

  const renderUcResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'usecase', // tests alias normalization
      mermaid_syntax: useCaseSyntax,
      scale: 2,
    },
  })) as any;

  if (renderUcResult.isError) {
    throw new Error(`Failed to render Use-Case diagram: ${renderUcResult.content?.[0]?.text}`);
  }
  const ucImageContent = renderUcResult.content?.find((c: any) => c.type === 'image');
  if (!ucImageContent?.data) {
    throw new Error('render_mermaid_to_png did not return base64 image data!');
  }
  console.log('✅ Test 5 Passed: Successfully normalized alias and rendered native UML Use-Case diagram to PNG.');

  // Test 6: Render with swimlane-beta
  console.log('\n--- Test 6: Render Swimlane Diagram ---');
  const swimlaneSyntax = `swimlane-beta LR
subgraph Customer
  Order[Place Order]
  Receive[Receive Goods]
end
subgraph Fulfillment
  Pack[Pack Items]
  Ship[Ship Package]
end

Order --> Pack
Pack --> Ship
Ship --> Receive`;

  const renderSwimResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'swimlane-beta',
      mermaid_syntax: swimlaneSyntax,
      scale: 2,
    },
  })) as any;

  if (renderSwimResult.isError) {
    throw new Error(`Failed to render Swimlane diagram: ${renderSwimResult.content?.[0]?.text}`);
  }
  console.log('✅ Test 6 Passed: Successfully rendered native Swimlanes diagram to PNG.');

  console.log('\n🎉 ALL 6 TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
