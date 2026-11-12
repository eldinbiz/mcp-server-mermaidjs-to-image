import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMcpStdio() {
  console.log('🔌 Testing MCP Server over stdio...\n');

  const serverScript = path.resolve('dist/index.js');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverScript],
  });

  const client = new Client(
    {
      name: 'test-mcp-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP Server over stdio.');

  // 1. List tools
  const { tools } = await client.listTools();
  console.log(`✅ Available MCP Tools (${tools.length}):`);
  for (const t of tools) {
    console.log(`   - ${t.name}: ${t.description.slice(0, 75)}...`);
  }

  if (!tools.some((t) => t.name === 'render_mermaid_to_png')) {
    throw new Error('Tool render_mermaid_to_png not found');
  }

  // 2. Call render_mermaid_to_png
  console.log('\n🎨 Calling render_mermaid_to_png...');
  const renderCall = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'flowchart',
      mermaid_syntax: 'graph LR\n  Client[AI Client] -->|stdio| Server[MCP Server]',
      theme: 'redux-color',
      look: 'neo',
      scale: 2,
    },
  })) as any;

  console.log('✅ Tool call response received:');
  const imageContent = renderCall.content?.find((c: any) => c.type === 'image');
  const textContent = renderCall.content?.find((c: any) => c.type === 'text');

  if (!imageContent || !imageContent.data) {
    throw new Error('Expected image content in MCP response, but none was returned.');
  }

  console.log(`   - Image MIME: ${imageContent.mimeType}`);
  console.log(`   - Base64 length: ${imageContent.data.length} characters`);
  console.log(`   - Text status: ${textContent?.text?.split('\n')[0]}`);

  // 3. Call render_mermaid_to_png with invalid syntax
  console.log('\n🧪 Testing error response on broken syntax...');
  const errorCall = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      mermaid_syntax: 'graph TD\n  A[Start] --> B\n  B -- invalid syntax label -- C',
    },
  })) as any;

  if (errorCall.isError !== true) {
    throw new Error(`Expected isError: true, but got: ${errorCall.isError}`);
  }

  console.log('✅ MCP correctly reported isError: true on invalid syntax!');
  const errorText = errorCall.content?.[0]?.text;
  console.log(`   - Diagnostic snippet:\n${errorText?.slice(0, 150)}...\n`);

  await client.close();
  console.log('🎉 MCP stdio protocol test passed successfully!');
}

testMcpStdio().catch((err) => {
  console.error('❌ MCP stdio test failed:', err);
  process.exit(1);
});
