import path from 'node:path';
import fs from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function generateProcurementDiagrams() {
  console.log('🚀 Connecting to Mermaid MCP Server via stdio...');

  const serverScript = path.resolve('dist/index.js');
  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverScript],
  });

  const client = new Client(
    { name: 'procurement-diagram-generator', version: '1.0.0' },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log('✅ Connected to MCP Server over stdio.');

  const docsDir = path.resolve('docs');
  await fs.promises.mkdir(docsDir, { recursive: true });

  // 1. Native UML Use-Case Diagram for Procurement
  console.log('\n🎨 1. Generating Procurement Use-Case Diagram (usecase-beta)...');
  const useCaseSyntax = `usecase-beta
direction LR

actor Requester("👤 Department Requester")
actor Approver("👔 Budget Approver")
actor Procurement("📋 Procurement Officer")
actor Supplier("🏢 Vendor / Supplier")
actor Finance("💰 Accounts Payable")

systemBoundary "🏢 Procurement Management System"
  CreatePR("Create Purchase Requisition")
  AttachSpecs("Attach Quotes & Specs")
  ReviewPR("Review & Approve PR")
  IssueRFQ("Publish & Evaluate RFQ")
  IssuePO("Generate Purchase Order (PO)")
  ConfirmPO("Acknowledge PO")
  RecordGRN("Record Goods Receipt (GRN)")
  SubmitInvoice("Submit Commercial Invoice")
  ThreeWayMatch("Perform 3-Way Match")
  DisbursePayment("Disburse Payment")
end

Requester --> CreatePR
Approver --> ReviewPR
Procurement --> IssueRFQ
Procurement --> IssuePO
Supplier --> ConfirmPO
Requester --> RecordGRN
Supplier --> SubmitInvoice
Finance --> ThreeWayMatch
Finance --> DisbursePayment

AttachSpecs ..> :extend CreatePR
ReviewPR ..> :include CreatePR
IssuePO ..> :include ReviewPR
ThreeWayMatch ..> :include RecordGRN
ThreeWayMatch ..> :include IssuePO
DisbursePayment ..> :include ThreeWayMatch`;

  const useCaseOutput = path.join(docsDir, 'procurement-usecase.png');
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
    console.error('❌ Failed to render Procurement Use-Case diagram:', ucResult.content?.[0]?.text);
    process.exit(1);
  }
  console.log('✅ Use-Case diagram successfully rendered:');
  console.log(ucResult.content?.find((c: any) => c.type === 'text')?.text);

  // 2. Native Swimlanes Diagram for Procurement
  console.log('\n🏊 2. Generating Procurement Process Swimlane Diagram (swimlane-beta)...');
  const swimlaneSyntax = `swimlane-beta LR
subgraph Requesting Department
  SubmitPR[📝 Submit Purchase Requisition]
  InspectGoods[📦 Inspect & Accept Goods]
end

subgraph Budget Approver
  ReviewPR[🔍 Verify Budget & Approve PR]
end

subgraph Procurement Team
  SelectVendor[🤝 Evaluate Quotes & Select Vendor]
  IssuePO[📄 Issue Purchase Order]
end

subgraph Supplier
  ProcessOrder[🏭 Acknowledge & Fulfill Order]
  ShipAndInvoice[🚚 Ship Goods & Dispatch Invoice]
end

subgraph Accounts Payable
  ThreeWayMatch[⚖️ 3-Way Match: PO, GRN & Invoice]
  ReleasePayment[💳 Authorize & Disburse Payment]
end

SubmitPR --> ReviewPR
ReviewPR --> SelectVendor
SelectVendor --> IssuePO
IssuePO --> ProcessOrder
ProcessOrder --> ShipAndInvoice
ShipAndInvoice --> InspectGoods
ShipAndInvoice --> ThreeWayMatch
InspectGoods --> ThreeWayMatch
ThreeWayMatch --> ReleasePayment`;

  const swimlaneOutput = path.join(docsDir, 'procurement-swimlane.png');
  const swimResult = (await client.callTool({
    name: 'render_mermaid_to_png',
    arguments: {
      diagram_type: 'swimlane-beta',
      mermaid_syntax: swimlaneSyntax,
      output_path: swimlaneOutput,
      theme: 'default',
      background: 'white',
      scale: 2,
    },
  })) as any;

  if (swimResult.isError) {
    console.error('❌ Failed to render Procurement Swimlane diagram:', swimResult.content?.[0]?.text);
    process.exit(1);
  }
  console.log('✅ Swimlane diagram successfully rendered:');
  console.log(swimResult.content?.find((c: any) => c.type === 'text')?.text);

  console.log('\n🎉 Both Procurement diagrams rendered successfully via MCP!');
  await transport.close();
  process.exit(0);
}

generateProcurementDiagrams().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
