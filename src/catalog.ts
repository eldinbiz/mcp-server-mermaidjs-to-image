export const MERMAID_VERSION = '12.3.0';

export interface DiagramEntry {
  canonicalKeyword: string;
  name: string;
  category: 'UML & Process' | 'Architecture & Systems' | 'Project Planning' | 'Charts & Visual Analytics' | 'Grammar & Specs';
  aliases: string[];
  description: string;
  starterSyntax: string;
}

export interface SyntaxGuide {
  diagramType: string;
  name: string;
  category: string;
  headerRequirement: string;
  syntaxElements: Array<{ element: string; description: string; example: string }>;
  connectorsOrRelationships?: Array<{ operator: string; description: string; example: string }>;
  commonPitfalls: string[];
  minimalExample: string;
  fullExample: string;
}

export const DIAGRAM_CATALOG: DiagramEntry[] = [
  // --- UML & Process ---
  {
    canonicalKeyword: 'usecase-beta',
    name: 'UML Use-Case Diagram',
    category: 'UML & Process',
    aliases: ['usecase', 'use-case', 'usecasediagram'],
    description: 'Native UML Use-Case diagram featuring authentic stick figure actors, system boundary containers, and UML use case ovals.',
    starterSyntax: 'usecase-beta\ndirection LR\nactor User("User")\nsystemBoundary "System"\n  Login("Log In")\nend\nUser --> Login',
  },
  {
    canonicalKeyword: 'swimlane-beta',
    name: 'Swimlane Diagram',
    category: 'UML & Process',
    aliases: ['swimlane', 'swimlanes', 'swimlane-diagram'],
    description: 'Multi-lane cross-functional process diagram with parallel column/row tracks, lane headers, and process handoffs.',
    starterSyntax: 'swimlane-beta LR\nsubgraph Lane1\n  A[Step 1]\nend\nsubgraph Lane2\n  B[Step 2]\nend\nA --> B',
  },
  {
    canonicalKeyword: 'flowchart',
    name: 'Flowchart / Graph',
    category: 'UML & Process',
    aliases: ['graph', 'flowchart-v2', 'flow'],
    description: 'Directed graph and flowchart with nodes, decisions, subgraphs, and multiple layout directions (TD, LR, BT, RL).',
    starterSyntax: 'flowchart TD\n  Start([Start]) --> Process[Process Data]\n  Process --> Done([Done])',
  },
  {
    canonicalKeyword: 'sequenceDiagram',
    name: 'Sequence Diagram',
    category: 'UML & Process',
    aliases: ['sequence', 'sequencediagram'],
    description: 'UML interaction and sequence diagram showing participants, lifelines, activation boxes, loops, and synchronous/asynchronous messages.',
    starterSyntax: 'sequenceDiagram\n  autonumber\n  Alice->>Bob: Hello Bob\n  Bob-->>Alice: Hi Alice',
  },
  {
    canonicalKeyword: 'classDiagram',
    name: 'Class Diagram',
    category: 'UML & Process',
    aliases: ['class', 'classdiagram', 'classDiagram-v2'],
    description: 'UML Class diagram modeling classes, interfaces, attributes, methods, inheritance, composition, and aggregation.',
    starterSyntax: 'classDiagram\n  class Animal {\n    +String name\n    +makeSound()\n  }\n  class Dog {\n    +bark()\n  }\n  Animal <|-- Dog',
  },
  {
    canonicalKeyword: 'stateDiagram-v2',
    name: 'State Diagram',
    category: 'UML & Process',
    aliases: ['stateDiagram', 'statediagram', 'statediagram-v2', 'state'],
    description: 'UML State machine diagram with states, transitions, composite states, forks, joins, and choice pseudo-states.',
    starterSyntax: 'stateDiagram-v2\n  [*] --> Idle\n  Idle --> Processing: Event\n  Processing --> [*]',
  },
  {
    canonicalKeyword: 'erDiagram',
    name: 'Entity-Relationship (ER) Diagram',
    category: 'UML & Process',
    aliases: ['er', 'erdiagram'],
    description: 'Chen and Crow\'s Foot Entity-Relationship diagram for database schema and entity relations.',
    starterSyntax: 'erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains\n  CUSTOMER {\n    string id\n    string name\n  }',
  },
  {
    canonicalKeyword: 'agentflow-beta',
    name: 'Agent Flow Diagram',
    category: 'UML & Process',
    aliases: ['agentflow', 'agent-flow'],
    description: 'Multi-agent orchestration workflow diagram mapping interactions and transitions among AI agents.',
    starterSyntax: 'agentflow-beta\nagent Planner\nagent Worker\nPlanner --> Worker',
  },

  // --- Architecture & Systems ---
  {
    canonicalKeyword: 'architecture',
    name: 'Architecture Diagram',
    category: 'Architecture & Systems',
    aliases: ['architecture-beta', 'arch'],
    description: 'Cloud and infrastructure architecture diagram with services, groups, networks, and icons.',
    starterSyntax: 'architecture\nservice api(server)[API Gateway]\nservice db(database)[PostgreSQL]\napi:R --> L:db',
  },
  {
    canonicalKeyword: 'C4Context',
    name: 'C4 Context Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4', 'c4-context', 'c4context'],
    description: 'C4 Model Context diagram displaying high-level system boundaries, enterprise users, and external software systems.',
    starterSyntax: 'C4Context\n  Person(user, "Customer", "A user of our platform")\n  System(system, "E-Commerce", "Allows buying goods")\n  Rel(user, system, "Uses")',
  },
  {
    canonicalKeyword: 'C4Container',
    name: 'C4 Container Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4container', 'c4-container'],
    description: 'C4 Model Container diagram illustrating applications, databases, and microservices inside a software system.',
    starterSyntax: 'C4Container\n  Container(spa, "Web App", "React", "Frontend")\n  ContainerDb(db, "Database", "PostgreSQL", "Stores data")\n  Rel(spa, db, "Reads/Writes", "HTTPS")',
  },
  {
    canonicalKeyword: 'C4Component',
    name: 'C4 Component Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4component', 'c4-component'],
    description: 'C4 Model Component diagram detailing internal modular controllers, services, and repositories within a container.',
    starterSyntax: 'C4Component\n  Component(auth, "Auth Controller", "Spring Boot", "Handles login")\n  Component(repo, "User Repo", "JPA", "Queries database")',
  },
  {
    canonicalKeyword: 'C4Dynamic',
    name: 'C4 Dynamic Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4dynamic'],
    description: 'C4 Model Dynamic diagram illustrating behavior and run-time sequence across containers or components.',
    starterSyntax: 'C4Dynamic\n  Container(spa, "Frontend")\n  Container(api, "Backend")\n  Rel(spa, api, "Submits order")',
  },
  {
    canonicalKeyword: 'C4Deployment',
    name: 'C4 Deployment Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4deployment'],
    description: 'C4 Model Deployment diagram mapping software containers to infrastructure nodes and cloud environments.',
    starterSyntax: 'C4Deployment\n  Deployment_Node(aws, "AWS", "Cloud") {\n    Deployment_Node(ecs, "ECS Cluster") {\n      Container(api, "API Service")\n    }\n  }',
  },
  {
    canonicalKeyword: 'packet-beta',
    name: 'Packet Diagram',
    category: 'Architecture & Systems',
    aliases: ['packet', 'packetdiagram'],
    description: 'Network packet layout and binary protocol byte/bit field visualizer.',
    starterSyntax: 'packet-beta\n0-15: "Source Port"\n16-31: "Destination Port"\n32-63: "Sequence Number"',
  },
  {
    canonicalKeyword: 'block-beta',
    name: 'Block Diagram',
    category: 'Architecture & Systems',
    aliases: ['block', 'blockdiagram'],
    description: 'Hardware and component block diagram with structured grid layout and dimensional blocks.',
    starterSyntax: 'block-beta\n  columns 3\n  A["Input"] B["Processor"]:2\n  C["Output"]:3',
  },
  {
    canonicalKeyword: 'flowchart-elk',
    name: 'Flowchart (ELK Layout)',
    category: 'Architecture & Systems',
    aliases: ['elk'],
    description: 'Flowchart rendered using the Eclipse Layout Kernel (ELK) for complex graph routing and orthogonal layouts.',
    starterSyntax: 'flowchart-elk\n  A --> B\n  B --> C',
  },
  {
    canonicalKeyword: 'eventmodeling',
    name: 'Event Modeling Diagram',
    category: 'Architecture & Systems',
    aliases: ['eventmodel', 'event-model'],
    description: 'Event-driven architecture diagram detailing Commands, Events, Read Models, and UI Views across time.',
    starterSyntax: 'eventmodeling\n  UI[Submit Order] -> Command[PlaceOrder] -> Event[OrderPlaced]',
  },
  {
    canonicalKeyword: 'wardley-beta',
    name: 'Wardley Map',
    category: 'Architecture & Systems',
    aliases: ['wardley', 'wardleymap'],
    description: 'Wardley strategic value-chain mapping from user need down to underlying components across evolution stages.',
    starterSyntax: 'wardley-beta\n  anchor User [0.95, 0.5]\n  component WebApp [0.8, 0.4]\n  User -> WebApp',
  },

  // --- Project Planning ---
  {
    canonicalKeyword: 'gantt',
    name: 'Gantt Chart',
    category: 'Project Planning',
    aliases: ['ganttchart'],
    description: 'Project schedule bar chart tracking tasks, milestones, dates, sections, and task dependencies.',
    starterSyntax: 'gantt\n  dateFormat YYYY-MM-DD\n  title Project Schedule\n  section Sprint 1\n  Design : 2026-01-01, 10d\n  Dev    : after Design, 14d',
  },
  {
    canonicalKeyword: 'timeline',
    name: 'Timeline Diagram',
    category: 'Project Planning',
    aliases: ['time-line'],
    description: 'Chronological timeline of events, eras, and milestones grouped by periods or quarters.',
    starterSyntax: 'timeline\n  title Product Roadmap\n  2026 Q1 : Alpha Release : Design System\n  2026 Q2 : Beta Testing',
  },
  {
    canonicalKeyword: 'kanban',
    name: 'Kanban Board',
    category: 'Project Planning',
    aliases: ['kanbanboard'],
    description: 'Agile Kanban board with columns (To Do, In Progress, Done) and cards.',
    starterSyntax: 'kanban\n  Todo\n    [Task 1]\n    [Task 2]\n  InProgress\n    [Task 3]\n  Done\n    [Task 4]',
  },
  {
    canonicalKeyword: 'gitGraph',
    name: 'Git Graph',
    category: 'Project Planning',
    aliases: ['git', 'gitgraph'],
    description: 'Git commit tree visualization with branches, commits, tags, and merges.',
    starterSyntax: 'gitGraph\n  commit\n  branch feature\n  checkout feature\n  commit\n  checkout main\n  merge feature',
  },
  {
    canonicalKeyword: 'journey',
    name: 'User Journey Map',
    category: 'Project Planning',
    aliases: ['userjourney', 'journeyMap'],
    description: 'Customer experience map tracking user actions, sentiment scores (1 to 5), and involved actors across task stages.',
    starterSyntax: 'journey\n  title My Working Day\n  section Morning\n    Make tea: 5: Me\n    Commute : 3: Me',
  },

  // --- Charts & Visual Analytics ---
  {
    canonicalKeyword: 'pie',
    name: 'Pie Chart',
    category: 'Charts & Visual Analytics',
    aliases: ['piechart'],
    description: 'Proportional pie chart displaying percentage or value distributions across categories.',
    starterSyntax: 'pie title Browser Market Share\n  "Chrome" : 65\n  "Safari" : 19\n  "Edge" : 5\n  "Firefox" : 3',
  },
  {
    canonicalKeyword: 'quadrantChart',
    name: 'Quadrant Chart',
    category: 'Charts & Visual Analytics',
    aliases: ['quadrant', 'quadrantchart'],
    description: '2x2 quadrant decision matrix for prioritizing initiatives, risks, or capabilities along X and Y axes.',
    starterSyntax: 'quadrantChart\n  title Priority Matrix\n  x-axis Low Effort --> High Effort\n  y-axis Low Impact --> High Impact\n  Feature A: [0.3, 0.8]\n  Feature B: [0.7, 0.2]',
  },
  {
    canonicalKeyword: 'xychart-beta',
    name: 'XY Chart (Line & Bar)',
    category: 'Charts & Visual Analytics',
    aliases: ['xychart', 'barchart', 'linechart'],
    description: 'Two-dimensional chart for plotting bar and line series against categorical or numerical axes.',
    starterSyntax: 'xychart-beta\n  title "Monthly Revenue"\n  x-axis [Jan, Feb, Mar, Apr]\n  y-axis "Revenue (k$)" 0 --> 100\n  bar [25, 40, 65, 80]\n  line [20, 35, 60, 75]',
  },
  {
    canonicalKeyword: 'sankey-beta',
    name: 'Sankey Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['sankey'],
    description: 'Flow diagram where link widths represent proportional quantities and volume transfers.',
    starterSyntax: 'sankey-beta\nSource,Target,Value\nSolar,Grid,50\nWind,Grid,30\nGrid,Consumers,80',
  },
  {
    canonicalKeyword: 'mindmap',
    name: 'Mindmap',
    category: 'Charts & Visual Analytics',
    aliases: ['mind-map'],
    description: 'Hierarchical brainstorming mindmap organized radially or tree-structured using indentation.',
    starterSyntax: 'mindmap\n  root((Project Planning))\n    Design\n      UI\n      UX\n    Backend\n      API\n      Database',
  },
  {
    canonicalKeyword: 'radar-beta',
    name: 'Radar / Spider Chart',
    category: 'Charts & Visual Analytics',
    aliases: ['radar', 'spiderchart'],
    description: 'Multi-variable radar / spider chart evaluating entities across multiple performance axes.',
    starterSyntax: 'radar-beta\n  axes: [Speed, Reliability, Security, Cost]\n  "Solution A": [80, 90, 70, 60]\n  "Solution B": [60, 70, 95, 85]',
  },
  {
    canonicalKeyword: 'venn-beta',
    name: 'Venn Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['venn'],
    description: 'Set intersection and Venn diagram highlighting overlapping logical relationships.',
    starterSyntax: 'venn-beta\n  A: "Engineering"\n  B: "Design"\n  A and B: "UI Engineers"',
  },
  {
    canonicalKeyword: 'treemap',
    name: 'Treemap Chart',
    category: 'Charts & Visual Analytics',
    aliases: ['treemapchart'],
    description: 'Hierarchical nested rectangle treemap showing relative proportions of leaf data items.',
    starterSyntax: 'treemap\n  Storage\n    Images: 45\n    Videos: 35\n    Documents: 20',
  },
  {
    canonicalKeyword: 'ishikawa-beta',
    name: 'Ishikawa / Fishbone Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['ishikawa', 'fishbone'],
    description: 'Cause-and-effect fishbone diagram identifying root causes across equipment, process, people, and materials.',
    starterSyntax: 'ishikawa-beta\n  Problem: "High Server Latency"\n  Hardware: Memory Leaks, Disk IO\n  Software: Query Indexing',
  },
  {
    canonicalKeyword: 'cynefin-beta',
    name: 'Cynefin Framework Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['cynefin'],
    description: 'Leader decision-making sensemaking framework categorizing contexts into Clear, Complicated, Complex, and Chaotic.',
    starterSyntax: 'cynefin-beta\n  Clear: Standard Operating Procedures\n  Complicated: Expert Analysis\n  Complex: Probe-Sense-Respond',
  },

  // --- Grammar & Specs ---
  {
    canonicalKeyword: 'railroad-beta',
    name: 'Railroad Syntax Diagram',
    category: 'Grammar & Specs',
    aliases: ['railroad'],
    description: 'Syntax diagram / railroad diagram representing formal language grammars and parser rules visually.',
    starterSyntax: 'railroad-beta\n  Diagram(\n    Sequence("SELECT", "FROM", "WHERE")\n  )',
  },
  {
    canonicalKeyword: 'railroad-ebnf-beta',
    name: 'EBNF Railroad Diagram',
    category: 'Grammar & Specs',
    aliases: ['ebnf', 'railroad-ebnf'],
    description: 'Visual railroad diagram derived directly from Extended Backus-Naur Form (EBNF) grammar rules.',
    starterSyntax: 'railroad-ebnf-beta\n  letter = "a" | "b" | "c" ;\n  digit = "0" | "1" ;',
  },
  {
    canonicalKeyword: 'railroad-abnf-beta',
    name: 'ABNF Railroad Diagram',
    category: 'Grammar & Specs',
    aliases: ['abnf', 'railroad-abnf'],
    description: 'Visual railroad diagram derived directly from Augmented BNF (RFC 5234) specifications.',
    starterSyntax: 'railroad-abnf-beta\n  rule1 = "GET" / "POST"\n  rule2 = %x20-7E',
  },
  {
    canonicalKeyword: 'railroad-peg-beta',
    name: 'PEG Railroad Diagram',
    category: 'Grammar & Specs',
    aliases: ['peg', 'railroad-peg'],
    description: 'Visual railroad diagram derived directly from Parsing Expression Grammar (PEG) expressions.',
    starterSyntax: 'railroad-peg-beta\n  Expr <- Term ("+" Term)*\n  Term <- Factor ("*" Factor)*',
  },
  {
    canonicalKeyword: 'requirementDiagram',
    name: 'Requirement Diagram',
    category: 'Grammar & Specs',
    aliases: ['requirement', 'requirementdiagram'],
    description: 'SysML Requirement diagram tracing engineering requirements, verification methods, and design elements.',
    starterSyntax: 'requirementDiagram\n  requirement test_req {\n    id: 1\n    text: System shall boot in < 5 seconds\n    risk: high\n    verifymethod: test\n  }',
  },
  {
    canonicalKeyword: 'treeView-beta',
    name: 'Tree View Diagram',
    category: 'Grammar & Specs',
    aliases: ['treeview', 'treeView'],
    description: 'Directory and file hierarchy tree visualizer.',
    starterSyntax: 'treeView-beta\n  src\n    index.ts\n    renderer.ts\n  package.json',
  },
];

export const SYNTAX_GUIDES: Record<string, SyntaxGuide> = {
  'usecase-beta': {
    diagramType: 'usecase-beta',
    name: 'UML Use-Case Diagram',
    category: 'UML & Process',
    headerRequirement: '`usecase-beta` (first line) followed optionally by `direction LR` or `direction TB`.',
    syntaxElements: [
      { element: 'actor Name("Label")', description: 'Declares an actor glyph (stick figure). Label in quotes is optional.', example: 'actor Customer("Online Customer")\nactor Admin' },
      { element: 'systemBoundary "Name" ... end', description: 'Defines a rectangular system boundary container enclosing use cases.', example: 'systemBoundary "Online Store"\n  Browse("Browse Catalog")\n  Checkout("Place Order")\nend' },
      { element: 'UseCaseId("Display Label")', description: 'Declares a UML oval use case with an ID and visible text label.', example: 'Login("Log In with MFA")\nPay("Process Payment")' },
      { element: 'note "Text" for ActorOrUC', description: 'Attaches an explanatory UML note to an actor or use case.', example: 'note "Requires 3DS verification" for Pay' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Solid association connecting an actor to a use case (or use case to use case).', example: 'Customer --> Browse\nCustomer --> Checkout' },
      { operator: '..> :include', description: 'Dotted UML «include» dependency with direction pointing to the included use case.', example: 'Checkout ..> :include Pay' },
      { operator: '..> :extend', description: 'Dotted UML «extend» dependency pointing to the base use case it extends.', example: 'ApplyCoupon ..> :extend Checkout' },
      { operator: '--|>', description: 'UML Generalization / inheritance relationship between actors or use cases.', example: 'StoreAdmin --|> GeneralUser' },
    ],
    commonPitfalls: [
      'CRITICAL: Do NOT write `system "..." { ... }`. The official Mermaid syntax is `systemBoundary "..." ... end`.',
      'CRITICAL: Do NOT write `..>|«include»|`. Use the exact keyword notation `..> :include TargetUC` and `..> :extend BaseUC`.',
      'CRITICAL: Use the keyword `usecase-beta` (the un-suffixed `usecase` or `use-case` is not recognized by Mermaid core unless normalized).',
      'Do NOT wrap use cases in `subgraph` or flow-like brackets like `([ ... ])`. Just declare `ID("Label")` inside `systemBoundary`.',
    ],
    minimalExample: `usecase-beta
direction LR

actor User("User")

systemBoundary "Platform"
  Login("Log In")
  Dashboard("View Dashboard")
end

User --> Login
User --> Dashboard`,
    fullExample: `usecase-beta
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
ApplyCoupon ..> :extend Checkout`,
  },

  'swimlane-beta': {
    diagramType: 'swimlane-beta',
    name: 'Swimlane Process Diagram',
    category: 'UML & Process',
    headerRequirement: '`swimlane-beta LR` (Left-to-Right) or `swimlane-beta TB` (Top-to-Bottom).',
    syntaxElements: [
      { element: 'subgraph LaneName ... end', description: 'Top-level subgraphs are automatically rendered as parallel swimlane columns or rows.', example: 'subgraph Customer\n  Browse[Browse Products]\nend\nsubgraph Warehouse\n  Pack[Pack Goods]\nend' },
      { element: 'NodeId["Label"]', description: 'Nodes defined within a subgraph belong to that swimlane.', example: 'Order[Place Order]\nInvoice[Generate Invoice]' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Connects steps within the same lane or across different swimlanes (process handoff).', example: 'Browse --> Order\nOrder --> Pack' },
      { operator: '-->|label|', description: 'Labeled transition indicating conditional branches or handoff data.', example: 'Pack -->|Dispatched| Ship' },
    ],
    commonPitfalls: [
      'CRITICAL: Must start with `swimlane-beta LR` or `swimlane-beta TB`. The bare keyword `swimlane` or `swimlanes` is rejected by Mermaid core.',
      'Lanes are declared using standard `subgraph LaneTitle ... end`. Top-level subgraphs are interpreted as lanes.',
      'Nodes are tied to the first lane in which they are declared.',
    ],
    minimalExample: `swimlane-beta LR
subgraph Customer
  Browse[Browse Catalogue]
  Pay[Pay Bill]
end
subgraph Warehouse
  Pick[Pick Items]
  Ship[Ship Order]
end

Browse --> Pay
Pay --> Pick
Pick --> Ship`,
    fullExample: `swimlane-beta LR
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
Dispatch --> Receive`,
  },

  'flowchart': {
    diagramType: 'flowchart',
    name: 'Flowchart / Graph',
    category: 'UML & Process',
    headerRequirement: '`flowchart TD` (Top-Down), `flowchart LR` (Left-to-Right), or `graph TD / LR`.',
    syntaxElements: [
      { element: 'id["Square Box"]', description: 'Standard rectangular node.', example: 'A["Process Data"]' },
      { element: 'id(["Rounded Box"])', description: 'Rounded rectangle (pill shape).', example: 'Start(["Start Process"])' },
      { element: 'id{"Decision"}', description: 'Rhombus / diamond decision node.', example: 'IsAdmin{"Is Admin?"}' },
      { element: 'id[("Database")]', description: 'Cylinder node representing data storage.', example: 'DB[("PostgreSQL")]' },
      { element: 'subgraph Title ... end', description: 'Visual cluster grouping related nodes.', example: 'subgraph Backend\n  API\n  DB\nend' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Directed solid arrow.', example: 'A --> B' },
      { operator: '---|text|', description: 'Solid link with text label.', example: 'A ---|Connection| B' },
      { operator: '-->|text|', description: 'Directed arrow with text label.', example: 'IsAdmin -->|Yes| Grant[Grant Access]' },
      { operator: '-.->', description: 'Dotted arrow.', example: 'Service -.-> Cache' },
      { operator: '==>', description: 'Thick directed arrow.', example: 'Build ==> Deploy' },
    ],
    commonPitfalls: [
      'If a node label contains parentheses, quotes, or brackets, ALWAYS enclose the text in double quotes: `id["Node (Details)"]`.',
      'Ensure subgraphs each have a matching `end`.',
    ],
    minimalExample: `flowchart TD
  Start([Start]) --> Check{Valid?}
  Check -->|Yes| Run[Run Task]
  Check -->|No| Stop([Stop])
  Run --> Stop`,
    fullExample: `flowchart LR
  Client["🖥️ Web Client"] -->|HTTPS / REST| Gateway["🛡️ API Gateway"]
  
  subgraph Cluster ["Core Microservices"]
    direction TB
    Auth["🔐 Auth Service"]
    Order["📦 Order Service"]
    Pay["💳 Payment Service"]
  end

  Gateway --> Auth
  Gateway --> Order
  Order --> Pay

  DB[("🗄️ PostgreSQL")]
  Order -.-> DB
  Pay -.-> DB`,
  },

  'sequenceDiagram': {
    diagramType: 'sequenceDiagram',
    name: 'Sequence Diagram',
    category: 'UML & Process',
    headerRequirement: '`sequenceDiagram` as the header line.',
    syntaxElements: [
      { element: 'autonumber', description: 'Automatically numbers interaction messages sequentially.', example: 'autonumber' },
      { element: 'actor Name as "Display Name"', description: 'Draws a human actor lifeline.', example: 'actor User as "👤 Customer"' },
      { element: 'participant Name as "Display Name"', description: 'Draws a system/component participant box.', example: 'participant API as "⚙️ Backend API"' },
      { element: 'activate / deactivate', description: 'Explicit activation boxes on lifelines.', example: 'activate API\nAPI-->>User: Result\ndeactivate API' },
      { element: 'opt / alt / loop / par ... end', description: 'Interaction frames for conditionals, choices, and loops.', example: 'alt Success\n  API-->>User: 200 OK\nelse Error\n  API-->>User: 400 Bad Request\nend' },
    ],
    connectorsOrRelationships: [
      { operator: '->>', description: 'Solid line with arrowhead (synchronous request).', example: 'User->>API: POST /login' },
      { operator: '-->>', description: 'Dashed line with arrowhead (response / reply).', example: 'API-->>User: 200 OK Token' },
      { operator: '-x', description: 'Message with cross end (lost message or failure).', example: 'API-xGateway: Timeout' },
      { operator: '->', description: 'Solid line without arrowhead.', example: 'User->Browser: Click' },
    ],
    commonPitfalls: [
      'Every `alt`, `opt`, `loop`, `critical`, or `par` block MUST be closed with an `end`.',
      'Do not put spaces inside arrows (`- ->>` is invalid, use `->>`).',
    ],
    minimalExample: `sequenceDiagram
  autonumber
  User->>Server: Request Data
  Server-->>User: Return Data`,
    fullExample: `sequenceDiagram
  autonumber
  actor User as "👤 Customer"
  participant Web as "🖥️ Web Client"
  participant API as "⚙️ Payment API"
  participant Bank as "🏦 Bank Gateway"

  User->>Web: Click "Pay $50"
  Web->>API: POST /checkout/charge
  activate API
  API->>Bank: Authorize Transaction
  activate Bank
  alt Transaction Authorized
    Bank-->>API: 200 Approved (AuthCode: #9482)
    API-->>Web: Order Confirmed
    Web-->>User: Show Receipt Screen
  else Insufficient Funds
    Bank-->>API: 402 Declined
    API-->>Web: Payment Error
    Web-->>User: Show "Card Declined" Notice
  end
  deactivate Bank
  deactivate API`,
  },

  'architecture': {
    diagramType: 'architecture',
    name: 'Cloud & Infrastructure Architecture',
    category: 'Architecture & Systems',
    headerRequirement: '`architecture` as the header line.',
    syntaxElements: [
      { element: 'group GroupId(icon)[Label]', description: 'Defines an infrastructure boundary, VPC, or cloud provider group.', example: 'group vpc(cloud)[AWS Virtual Private Cloud]' },
      { element: 'service ServiceId(icon)[Label] in GroupId', description: 'Defines a cloud service/resource inside an optional group.', example: 'service lb(internet)[ALB Load Balancer] in vpc' },
    ],
    connectorsOrRelationships: [
      { operator: 'L:Left --> R:Right', description: 'Connects resource directional ports (L, R, T, B).', example: 'lb:R --> L:api' },
    ],
    commonPitfalls: [
      'Port directions (L, R, T, B) are case-sensitive and must precede and follow the arrow.',
    ],
    minimalExample: `architecture
service client(internet)[Web Browser]
service api(server)[Application Server]
client:R --> L:api`,
    fullExample: `architecture
group aws(cloud)[Amazon Web Services VPC]

service lb(internet)[Application Load Balancer] in aws
service api(server)[ECS Microservices] in aws
service db(database)[Amazon Aurora RDS] in aws
service cache(database)[Redis ElastiCache] in aws

lb:R --> L:api
api:B --> T:db
api:R --> L:cache`,
  },
};

/**
 * Returns a formatted summary of all supported diagrams grouped by category
 */
export function getSupportedDiagramsSummary(categoryFilter?: string, query?: string): string {
  const normCategory = categoryFilter?.trim().toLowerCase();
  const normQuery = query?.trim().toLowerCase();

  let filtered = DIAGRAM_CATALOG;

  if (normCategory) {
    filtered = filtered.filter((d) => d.category.toLowerCase().includes(normCategory));
  }

  if (normQuery) {
    filtered = filtered.filter(
      (d) =>
        d.canonicalKeyword.toLowerCase().includes(normQuery) ||
        d.name.toLowerCase().includes(normQuery) ||
        d.aliases.some((a) => a.toLowerCase().includes(normQuery)) ||
        d.description.toLowerCase().includes(normQuery)
    );
  }

  const grouped: Record<string, DiagramEntry[]> = {};
  for (const item of filtered) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }

  const lines: string[] = [
    `# Supported Mermaid Diagram Types (Mermaid.js Engine v${MERMAID_VERSION})`,
    `Total supported diagram types: **${DIAGRAM_CATALOG.length}** across 5 categories.`,
    '',
    '> [!TIP]',
    '> **How to get detailed syntax rules for any diagram**:',
    '> Call the **`get_diagram_syntax_guide`** tool with the diagram keyword (e.g. `get_diagram_syntax_guide({ diagram_type: "usecase-beta" })`) to retrieve exact grammar rules, connectors, common mistakes to avoid, and verified working examples.',
    '',
  ];

  for (const [categoryName, items] of Object.entries(grouped)) {
    lines.push(`## ${categoryName}`);
    lines.push('| Keyword | Diagram Name | Accepted Aliases | Description |');
    lines.push('| :--- | :--- | :--- | :--- |');
    for (const item of items) {
      const aliasStr = item.aliases.length > 0 ? item.aliases.map((a) => `\`${a}\``).join(', ') : '-';
      lines.push(`| **\`${item.canonicalKeyword}\`** | ${item.name} | ${aliasStr} | ${item.description} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Retrieves the comprehensive syntax guide for a requested diagram type
 */
export function getDiagramSyntaxGuide(diagramTypeInput: string): { success: boolean; content: string } {
  const normalized = validateAndNormalizeDiagramType(diagramTypeInput);
  if (!normalized.valid || !normalized.canonicalKeyword) {
    return {
      success: false,
      content: normalized.feedbackMessage || `Unknown diagram type: "${diagramTypeInput}".`,
    };
  }

  const guide = SYNTAX_GUIDES[normalized.canonicalKeyword];
  if (guide) {
    const lines: string[] = [
      `# Syntax Guide: ${guide.name} (\`${guide.diagramType}\`)`,
      `- **Category**: ${guide.category}`,
      `- **Mermaid Engine**: v${MERMAID_VERSION}`,
      `- **Header Requirement**: ${guide.headerRequirement}`,
      '',
      '## Core Syntax Elements',
    ];

    for (const el of guide.syntaxElements) {
      lines.push(`### \`${el.element}\``);
      lines.push(el.description);
      lines.push('```mermaid');
      lines.push(el.example);
      lines.push('```');
      lines.push('');
    }

    if (guide.connectorsOrRelationships && guide.connectorsOrRelationships.length > 0) {
      lines.push('## Connectors & Relationships');
      lines.push('| Operator | Description | Example |');
      lines.push('| :--- | :--- | :--- |');
      for (const conn of guide.connectorsOrRelationships) {
        lines.push(`| \`${conn.operator}\` | ${conn.description} | \`${conn.example.replace(/\n/g, '; ')}\` |`);
      }
      lines.push('');
    }

    if (guide.commonPitfalls && guide.commonPitfalls.length > 0) {
      lines.push('## Common Pitfalls & Mistakes to Avoid');
      for (const pitfall of guide.commonPitfalls) {
        lines.push(`- ⚠️ ${pitfall}`);
      }
      lines.push('');
    }

    lines.push('## Minimal Working Example');
    lines.push('```mermaid');
    lines.push(guide.minimalExample);
    lines.push('```');
    lines.push('');

    lines.push('## Complete Real-World Example');
    lines.push('```mermaid');
    lines.push(guide.fullExample);
    lines.push('```');

    return { success: true, content: lines.join('\n') };
  }

  // Fallback for diagram types that have catalog entry but not a specialized guide object
  const entry = DIAGRAM_CATALOG.find((d) => d.canonicalKeyword === normalized.canonicalKeyword);
  if (!entry) {
    return {
      success: false,
      content: `No guide available for diagram type "${diagramTypeInput}".`,
    };
  }

  return {
    success: true,
    content: [
      `# Syntax Guide: ${entry.name} (\`${entry.canonicalKeyword}\`)`,
      `- **Category**: ${entry.category}`,
      `- **Mermaid Engine**: v${MERMAID_VERSION}`,
      `- **Description**: ${entry.description}`,
      `- **Accepted Aliases**: ${entry.aliases.map((a) => `\`${a}\``).join(', ')}`,
      '',
      '## Starter Example',
      '```mermaid',
      entry.starterSyntax,
      '```',
    ].join('\n'),
  };
}

/**
 * Validates and maps user input diagram type to the canonical keyword recognized by Mermaid 12.3.0
 */
export function validateAndNormalizeDiagramType(input?: string): {
  valid: boolean;
  canonicalKeyword?: string;
  matchedEntry?: DiagramEntry;
  feedbackMessage?: string;
} {
  if (!input || !input.trim()) {
    return {
      valid: false,
      feedbackMessage: buildKeywordRejectionMessage('No `diagram_type` parameter was provided.'),
    };
  }

  const clean = input.trim().toLowerCase();

  for (const entry of DIAGRAM_CATALOG) {
    if (entry.canonicalKeyword.toLowerCase() === clean) {
      return { valid: true, canonicalKeyword: entry.canonicalKeyword, matchedEntry: entry };
    }
    for (const alias of entry.aliases) {
      if (alias.toLowerCase() === clean) {
        return { valid: true, canonicalKeyword: entry.canonicalKeyword, matchedEntry: entry };
      }
    }
  }

  return {
    valid: false,
    feedbackMessage: buildKeywordRejectionMessage(`Unrecognized diagram type: "${input}".`),
  };
}

/**
 * Formats a user-friendly error message listing available keywords when an invalid or missing diagram_type is detected
 */
export function buildKeywordRejectionMessage(reason: string): string {
  const summaryByCat: Record<string, string[]> = {};
  for (const d of DIAGRAM_CATALOG) {
    if (!summaryByCat[d.category]) {
      summaryByCat[d.category] = [];
    }
    summaryByCat[d.category].push(`\`${d.canonicalKeyword}\``);
  }

  const lines = [
    `❌ **Diagram Render Rejected: Mandatory Diagram Type Missing or Invalid**`,
    '',
    reason,
    '',
    `Mermaid.js engine v${MERMAID_VERSION} requires an explicit \`diagram_type\` parameter to ensure accurate rendering and prevent syntax mismatch.`,
    '',
    '### Available Keywords by Category:',
  ];

  for (const [cat, keywords] of Object.entries(summaryByCat)) {
    lines.push(`- **${cat}**: ${keywords.join(', ')}`);
  }

  lines.push('');
  lines.push('💡 **How to proceed**:');
  lines.push('1. Call `get_supported_diagrams` to browse all diagram options and accepted aliases.');
  lines.push('2. Call `get_diagram_syntax_guide({ diagram_type: "<keyword>" })` to retrieve exact syntax rules and verified examples.');
  lines.push('3. Provide the valid `diagram_type` alongside your `mermaid_syntax` to render your diagram.');

  return lines.join('\n');
}
