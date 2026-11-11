import path from 'node:path';
import fs from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function generateDiagrams() {
  console.log('🚀 Connecting to Mermaid MCP Server via stdio...');

  const serverScript = path.resolve('dist/index.js');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverScript],
  });

  const client = new Client(
    { name: 'diagram-generator', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP Server.');

  const docsDir = path.resolve('docs');
  await fs.promises.mkdir(docsDir, { recursive: true });

  // 1. Native UML Use-Case Diagram
  console.log('\n🎨 1. Generating Native UML Use-Case Diagram (usecase-beta)...');
  const useCaseSyntax = `usecase-beta
direction LR

actor Customer("👤 Customer")
actor Admin("👤 Store Admin")
actor PaymentGateway("🏦 Payment Provider")

systemBoundary "🛒 Online Retail System"
  Browse("Search & Browse Catalog")
  Cart("Manage Shopping Cart")
  Checkout("Checkout & Place Order")
  ProcessPayment("Process Credit Card")
  ApplyCoupon("Apply Discount Coupon")
  Shipment("Track Shipment Status")
  Inventory("Manage Warehouse Stock")
end

Customer --> Browse
Customer --> Cart
Customer --> Checkout
Customer --> Shipment

Admin --> Inventory
PaymentGateway --> ProcessPayment

Checkout ..> :include ProcessPayment
ApplyCoupon ..> :extend Checkout`;

  const useCaseOutput = path.join(docsDir, 'use-case-diagram.png');
  const ucResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'usecase-beta',
      mermaid_syntax: useCaseSyntax,
      output_path: useCaseOutput,
      theme: 'default',
      background: 'white',
      scale: 2,
    },
  })) as any;

  if (ucResult.isError) {
    console.error('❌ Failed to render Use-Case diagram:', ucResult.content?.[0]?.text);
    process.exit(1);
  }
  console.log('✅ Use-Case diagram generated at:', useCaseOutput);

  // 2. Native Swimlanes Diagram
  console.log('\n🏊 2. Generating Native Swimlanes Diagram (swimlane-beta)...');
  const swimlanesSyntax = `swimlane-beta LR
subgraph Customer
  Order[🛒 Place Order & Checkout]
  Receive[📦 Receive Delivered Package]
end

subgraph Order Service
  CreateOrder[📝 Create Order]
  ConfirmOrder[✅ Confirm Order & Create Invoice]
  SendTracking[🔔 Send Shipping Tracking]
end

subgraph Payment Gateway
  Authorize[🔒 Verify Card & Authorize Funds]
  Capture[💳 Settle Transaction]
end

subgraph Warehouse & Logistics
  PickPack[📦 Pick & Pack Items]
  Dispatch[🚚 Hand over to Courier]
end

Order --> CreateOrder
CreateOrder --> Authorize
Authorize --> ConfirmOrder
ConfirmOrder --> Capture
ConfirmOrder --> PickPack
PickPack --> Dispatch
Dispatch --> SendTracking
Dispatch --> Receive`;

  const swimlanesOutput = path.join(docsDir, 'swimlanes-diagram.png');
  const swimResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'swimlane-beta',
      mermaid_syntax: swimlanesSyntax,
      output_path: swimlanesOutput,
      theme: 'default',
      background: 'white',
      scale: 2,
    },
  })) as any;

  if (swimResult.isError) {
    console.error('❌ Failed to render Swimlanes diagram:', swimResult.content?.[0]?.text);
    process.exit(1);
  }
  console.log('✅ Swimlanes diagram generated at:', swimlanesOutput);

  console.log('\n🎉 Both native diagrams generated successfully!');
  await transport.close();
  process.exit(0);
}

generateDiagrams().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
