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
    starterSyntax: 'agentflow-beta TB\n  flow planner["Planner Agent"]\n    plan["Draft Execution Plan"]@{ shape: task }\n  end\n  flow worker["Worker Agent"]\n    exec["Run Tool"]@{ shape: tool }\n  end\n  planner --> worker',
  },

  // --- Architecture & Systems ---
  {
    canonicalKeyword: 'architecture',
    name: 'Architecture Diagram',
    category: 'Architecture & Systems',
    aliases: ['architecture-beta', 'arch'],
    description: 'Cloud and infrastructure architecture diagram with services, groups, networks, and icons.',
    starterSyntax: 'architecture-beta\n  service api(server)[API Gateway]\n  service db(database)[PostgreSQL]\n  api:R --> L:db',
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
    starterSyntax: 'C4Component\n  Component(auth, "Auth Controller", "Spring Boot", "Handles login")\n  Component(repo, "User Repo", "JPA", "Queries database")\n  Rel(auth, repo, "Calls")',
  },
  {
    canonicalKeyword: 'C4Dynamic',
    name: 'C4 Dynamic Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4dynamic'],
    description: 'C4 Model Dynamic diagram illustrating behavior and run-time sequence across containers or components.',
    starterSyntax: 'C4Dynamic\n  Container(spa, "Frontend", "React")\n  Container(api, "Backend", "Node.js")\n  Rel(spa, api, "Submits order", "HTTPS")',
  },
  {
    canonicalKeyword: 'C4Deployment',
    name: 'C4 Deployment Diagram',
    category: 'Architecture & Systems',
    aliases: ['c4deployment'],
    description: 'C4 Model Deployment diagram mapping software containers to infrastructure nodes and cloud environments.',
    starterSyntax: 'C4Deployment\n  Deployment_Node(aws, "AWS", "Cloud") {\n    Deployment_Node(ecs, "ECS Cluster", "Docker") {\n      Container(api, "API Service", "Node.js", "REST API")\n    }\n  }',
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
    starterSyntax: 'flowchart-elk\n  A[Source] --> B[Router]\n  B --> C[Destination]',
  },
  {
    canonicalKeyword: 'eventmodeling',
    name: 'Event Modeling Diagram',
    category: 'Architecture & Systems',
    aliases: ['eventmodel', 'event-model'],
    description: 'Event-driven architecture diagram detailing Commands, Events, Read Models, and UI Views across time.',
    starterSyntax: 'eventmodeling\n  tf 01 ui CartUI\n  tf 02 cmd AddItem\n  tf 03 evt ItemAdded',
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
    starterSyntax: 'sankey-beta\n%% source,target,value\nSolar,Grid,50\nWind,Grid,30\nGrid,Consumers,80',
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
    starterSyntax: 'radar-beta\n  axis Speed, Reliability, Security, Cost\n  curve a["Solution A"]{80, 90, 70, 60}\n  curve b["Solution B"]{60, 70, 95, 85}',
  },
  {
    canonicalKeyword: 'venn-beta',
    name: 'Venn Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['venn'],
    description: 'Set intersection and Venn diagram highlighting overlapping logical relationships.',
    starterSyntax: 'venn-beta\n  set A["Engineering"]\n  set B["Design"]\n  union A,B["UI Engineers"]',
  },
  {
    canonicalKeyword: 'treemap',
    name: 'Treemap Chart',
    category: 'Charts & Visual Analytics',
    aliases: ['treemap-beta', 'treemapchart'],
    description: 'Hierarchical nested rectangle treemap showing relative proportions of leaf data items.',
    starterSyntax: 'treemap-beta\n  "Storage"\n    "Images": 45\n    "Videos": 35\n    "Documents": 20',
  },
  {
    canonicalKeyword: 'ishikawa-beta',
    name: 'Ishikawa / Fishbone Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['ishikawa', 'fishbone'],
    description: 'Cause-and-effect fishbone diagram identifying root causes across equipment, process, people, and materials.',
    starterSyntax: 'ishikawa-beta\n  High Server Latency\n    Hardware\n      Memory Leaks\n      Disk IO\n    Software\n      Query Indexing',
  },
  {
    canonicalKeyword: 'cynefin-beta',
    name: 'Cynefin Framework Diagram',
    category: 'Charts & Visual Analytics',
    aliases: ['cynefin'],
    description: 'Leader decision-making sensemaking framework categorizing contexts into Clear, Complicated, Complex, and Chaotic.',
    starterSyntax: 'cynefin-beta\n  clear\n    "Standard Operating Procedures"\n  complicated\n    "Expert Analysis"\n  complex\n    "Probe-Sense-Respond"\n  chaotic\n    "Crisis Response"',
  },

  // --- Grammar & Specs ---
  {
    canonicalKeyword: 'railroad-beta',
    name: 'Railroad Syntax Diagram',
    category: 'Grammar & Specs',
    aliases: ['railroad'],
    description: 'Syntax diagram / railroad diagram representing formal language grammars and parser rules visually.',
    starterSyntax: 'railroad-beta\n  query = sequence(terminal("SELECT"), nonterminal("columns"), terminal("FROM"), nonterminal("table")) ;',
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
    starterSyntax: 'railroad-abnf-beta\n  request = ("GET" / "POST") SP path ;\n  path = 1*( ALPHA / DIGIT / "/" ) ;',
  },
  {
    canonicalKeyword: 'railroad-peg-beta',
    name: 'PEG Railroad Diagram',
    category: 'Grammar & Specs',
    aliases: ['peg', 'railroad-peg'],
    description: 'Visual railroad diagram derived directly from Parsing Expression Grammar (PEG) expressions.',
    starterSyntax: 'railroad-peg-beta\n  Expr <- Term (("+" / "-") Term)* ;\n  Term <- Factor (("*" / "/") Factor)* ;',
  },
  {
    canonicalKeyword: 'requirementDiagram',
    name: 'Requirement Diagram',
    category: 'Grammar & Specs',
    aliases: ['requirement', 'requirementdiagram'],
    description: 'SysML Requirement diagram tracing engineering requirements, verification methods, and design elements.',
    starterSyntax: 'requirementDiagram\n  requirement test_req {\n    id: 1\n    text: System shall boot in under 5 seconds\n    risk: high\n    verifymethod: test\n  }',
  },
  {
    canonicalKeyword: 'treeView-beta',
    name: 'Tree View Diagram',
    category: 'Grammar & Specs',
    aliases: ['treeview', 'treeView'],
    description: 'Directory and file hierarchy tree visualizer.',
    starterSyntax: 'treeView-beta\n  src/\n    index.ts\n    renderer.ts\n  package.json',
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
    fullExample: `architecture-beta
group aws(cloud)[Amazon Web Services VPC]

service lb(internet)[Application Load Balancer] in aws
service api(server)[ECS Microservices] in aws
service db(database)[Amazon Aurora RDS] in aws
service cache(database)[Redis ElastiCache] in aws

lb:R --> L:api
api:B --> T:db
api:R --> L:cache`,
  },

  'classDiagram': {
    diagramType: 'classDiagram',
    name: 'Class Diagram',
    category: 'UML & Process',
    headerRequirement: '`classDiagram` as the first line (case-sensitive `D`).',
    syntaxElements: [
      { element: 'class ClassName { ... }', description: 'Declares a class with attributes and methods inside braces.', example: 'class Order {\n  +String id\n  +Date createdAt\n  +calculateTotal() Decimal\n}' },
      { element: '+ / - / # / ~', description: 'Visibility modifiers: `+` public, `-` private, `#` protected, `~` package/internal.', example: 'class User {\n  -String passwordHash\n  +String email\n  +authenticate() bool\n}' },
      { element: '<<interface>> / <<abstract>>', description: 'Stereotype annotations declared inside or on a class.', example: 'class PaymentProcessor {\n  <<interface>>\n  +charge(amount) bool\n}' },
    ],
    connectorsOrRelationships: [
      { operator: '<|--', description: 'Inheritance / Generalization (subclass extends superclass).', example: 'Animal <|-- Dog' },
      { operator: '*--', description: 'Composition (strong lifecycle ownership).', example: 'Order *-- LineItem' },
      { operator: 'o--', description: 'Aggregation (weak ownership).', example: 'Department o-- Employee' },
      { operator: '-->', description: 'Directed association.', example: 'Order --> Customer : belongs to' },
      { operator: '..|>', description: 'Realization / Interface implementation.', example: 'PaymentProcessor <|.. StripeProcessor' },
    ],
    commonPitfalls: [
      'Do NOT use commas between class attributes or methods; put each member on its own line.',
      'Multiplicity strings on relationships must be wrapped in double quotes: `Customer "1" --> "*" Order : places`.',
    ],
    minimalExample: `classDiagram
  class Animal {
    +String name
    +makeSound()
  }
  class Dog {
    +bark()
  }
  Animal <|-- Dog`,
    fullExample: `classDiagram
  class PaymentGateway {
    <<interface>>
    +authorize(amount) AuthResult
    +capture(txId) bool
  }
  class StripeGateway {
    -String apiKey
    +authorize(amount) AuthResult
    +capture(txId) bool
  }
  class Order {
    +String orderId
    +Decimal totalAmount
    +checkout() bool
  }
  class LineItem {
    +String sku
    +int quantity
    +Decimal unitPrice
  }
  PaymentGateway <|.. StripeGateway
  Order "1" *-- "1..*" LineItem : contains
  Order --> PaymentGateway : uses`,
  },

  'stateDiagram-v2': {
    diagramType: 'stateDiagram-v2',
    name: 'State Diagram',
    category: 'UML & Process',
    headerRequirement: '`stateDiagram-v2` (recommended) or `stateDiagram` as the first line.',
    syntaxElements: [
      { element: '[*]', description: 'Start or end pseudo-state depending on arrow direction.', example: '[*] --> Idle\nCompleted --> [*]' },
      { element: 'state "Display Label" as StateId', description: 'Defines a state with a descriptive label and clean identifier.', example: 'state "Awaiting Payment" as AwaitPay' },
      { element: 'state CompositeState { ... }', description: 'Defines a nested composite state containing sub-states.', example: 'state Active {\n  [*] --> Running\n  Running --> Paused\n}' },
      { element: 'state id <<choice>> / <<fork>> / <<join>>', description: 'Defines UML choice diamonds or fork/join synchronization bars.', example: 'state checkValid <<choice>>' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'State transition with optional `: Event / Action` label.', example: 'Idle --> Processing : SubmitOrder' },
    ],
    commonPitfalls: [
      'State IDs cannot contain spaces unless aliased with `state "My State" as MyState`.',
      'Ensure all composite `state Name { ... }` blocks have a matching closing `}`.',
    ],
    minimalExample: `stateDiagram-v2
  [*] --> Idle
  Idle --> Processing : Start
  Processing --> [*] : Complete`,
    fullExample: `stateDiagram-v2
  [*] --> Created
  Created --> PendingPayment : Checkout

  state PendingPayment {
    [*] --> Authorizing
    Authorizing --> Authorized : CardApproved
    Authorizing --> Failed : CardDeclined
  }

  PendingPayment --> Fulfilling : PaymentCaptured
  Fulfilling --> Shipped : Dispatched
  Shipped --> Delivered : Confirmed
  Delivered --> [*]`,
  },

  'erDiagram': {
    diagramType: 'erDiagram',
    name: 'Entity-Relationship (ER) Diagram',
    category: 'UML & Process',
    headerRequirement: '`erDiagram` as the first line (case-sensitive `D`).',
    syntaxElements: [
      { element: 'ENTITY { type name PK/FK "comment" }', description: 'Declares an entity block with typed columns, key markers (`PK`, `FK`, `UK`), and optional comments.', example: 'USERS {\n  uuid id PK\n  varchar email UK\n  timestamp created_at\n}' },
    ],
    connectorsOrRelationships: [
      { operator: '||--o{', description: 'One-to-zero-or-many relationship (mandatory one to optional many).', example: 'CUSTOMER ||--o{ ORDER : places' },
      { operator: '||--|{', description: 'One-to-one-or-many relationship (mandatory one to mandatory many).', example: 'ORDER ||--|{ LINE_ITEM : includes' },
      { operator: '}o--o{', description: 'Zero-or-many to zero-or-many relationship.', example: 'STUDENT }o--o{ COURSE : enrolls' },
      { operator: '||--||', description: 'Strict one-to-one relationship.', example: 'USER ||--|| PROFILE : has' },
    ],
    commonPitfalls: [
      'Attribute definitions inside `{ ... }` must be `type name` (no colons or commas) and types/names cannot contain spaces.',
      'Relationship labels after `:` must be a single word or wrapped in double quotes: `USER ||--o{ ORDER : "places order"`.',
    ],
    minimalExample: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  CUSTOMER {
    string id PK
    string email UK
  }`,
    fullExample: `erDiagram
  CUSTOMERS ||--o{ ORDERS : "places"
  ORDERS ||--|{ ORDER_ITEMS : "contains"
  PRODUCTS ||--o{ ORDER_ITEMS : "referenced in"

  CUSTOMERS {
    uuid customer_id PK
    varchar full_name
    varchar email UK
  }
  ORDERS {
    uuid order_id PK
    uuid customer_id FK
    varchar status
    decimal total_amount
  }
  ORDER_ITEMS {
    uuid item_id PK
    uuid order_id FK
    uuid product_id FK
    int quantity
  }
  PRODUCTS {
    uuid product_id PK
    varchar sku UK
    decimal unit_price
  }`,
  },

  'agentflow-beta': {
    diagramType: 'agentflow-beta',
    name: 'Agent Flow Diagram',
    category: 'UML & Process',
    headerRequirement: '`agentflow-beta` optionally followed by direction (`TB`, `TD`, `BT`, `LR`, `RL`).',
    syntaxElements: [
      { element: 'flow id["Agent Label"] ... end', description: 'Groups tasks, tools, and decisions belonging to an AI agent or sub-workflow.', example: 'flow planner["Planner Agent"]\n  draft["Draft Plan"]@{ shape: task }\nend' },
      { element: 'id["Label"]@{ shape: task | tool | input | decision | refdoc | action }', description: 'Declares a typed agent workflow node using semantic shapes.', example: 'search["web_search"]@{ shape: tool }\ncheck["Valid?"]@{ shape: decision }' },
      { element: 'connector id["System"]', description: 'Declares an external API or tool connector endpoint.', example: 'connector github["GitHub API"]' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Sequence flow of control or data from source to target.', example: 'draft --> search' },
      { operator: '-.-', description: 'Reference link (agent consults a reference document or corpus without transferring control).', example: 'draft -.- styleGuide' },
      { operator: '--x', description: 'Failure / fallback edge out of a step.', example: 'validate --x retryStep' },
    ],
    commonPitfalls: [
      'CRITICAL: Do NOT write `agent Name`. Group agent activities using `flow id["Agent Name"] ... end` and typed nodes `id["Label"]@{ shape: task }`.',
      'Every `flow ...` or `global ...` container must close with `end`.',
    ],
    minimalExample: `agentflow-beta TB
  flow planner["Planner Agent"]
    plan["Create Plan"]@{ shape: task }
  end
  flow worker["Executor Agent"]
    run["Execute Tool"]@{ shape: tool }
  end
  planner --> worker`,
    fullExample: `agentflow-beta TB
  brief["User Prompt"]@{ shape: input }

  flow writer["Drafting Agent"]
    draft["Draft Response"]@{ shape: task }
    search["search_docs"]@{ shape: tool }
    guide["Style Guide"]@{ shape: refdoc }
    draft --> search
    draft -.- guide
  end

  flow reviewer["Review Agent"]
    verify["Verify Claims"]@{ shape: task }
    ok["Approved?"]@{ shape: decision }
    verify --> ok
  end

  publish["Publish Output"]@{ shape: action }
  brief --> writer
  writer --> reviewer
  ok -- yes --> publish
  ok -- no --x writer`,
  },

  'C4Context': {
    diagramType: 'C4Context',
    name: 'C4 Context Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`C4Context` as the first line (case-sensitive).',
    syntaxElements: [
      { element: 'Person(id, "Label", "Description")', description: 'Defines a human user or actor interacting with the system.', example: 'Person(customer, "Customer", "Retail buyer")' },
      { element: 'System(id, "Label", "Description")', description: 'Defines the primary software system in scope.', example: 'System(store, "E-Commerce Platform", "Handles orders")' },
      { element: 'System_Ext(id, "Label", "Description")', description: 'Defines an external third-party software system.', example: 'System_Ext(stripe, "Stripe", "Payment gateway")' },
      { element: 'Enterprise_Boundary(id, "Label") { ... }', description: 'Groups internal systems and actors inside an enterprise boundary.', example: 'Enterprise_Boundary(eb, "Acme Corp") {\n  System(store, "Store")\n}' },
    ],
    connectorsOrRelationships: [
      { operator: 'Rel(from, to, "Label", "Tech")', description: 'Directed relationship between two C4 elements.', example: 'Rel(customer, store, "Browses & buys", "HTTPS")' },
      { operator: 'BiRel(a, b, "Label")', description: 'Bidirectional relationship between two C4 elements.', example: 'BiRel(store, erp, "Syncs inventory")' },
    ],
    commonPitfalls: [
      'Function macros (`Person`, `System`, `System_Ext`, `Rel`) are case-sensitive.',
      'Boundary blocks use curly braces `{ ... }`, not `end`.',
    ],
    minimalExample: `C4Context
  Person(user, "Customer", "Uses the platform")
  System(app, "Online Store", "Allows purchasing items")
  Rel(user, app, "Places orders", "HTTPS")`,
    fullExample: `C4Context
  title System Context Diagram for Online Banking
  Person(customer, "Banking Customer", "Manages accounts and transfers")
  Enterprise_Boundary(b0, "Bank Enterprise") {
    System(banking, "Internet Banking System", "Provides account summaries and payments")
    System_Ext(mainframe, "Core Banking Mainframe", "Stores customer accounts and ledger")
  }
  System_Ext(email, "Email Provider", "Sends transactional alerts")

  Rel(customer, banking, "Views balances & transfers funds", "HTTPS")
  Rel(banking, mainframe, "Reads & posts transactions", "JDBC/TLS")
  Rel(banking, email, "Sends notifications", "SMTP")`,
  },

  'C4Container': {
    diagramType: 'C4Container',
    name: 'C4 Container Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`C4Container` as the first line (case-sensitive).',
    syntaxElements: [
      { element: 'Container(id, "Label", "Technology", "Description")', description: 'Defines an application or service container (web app, API, worker).', example: 'Container(spa, "Single-Page App", "React / TypeScript", "Delivers UI")' },
      { element: 'ContainerDb(id, "Label", "Technology", "Description")', description: 'Defines a database or data store container.', example: 'ContainerDb(db, "Primary Database", "PostgreSQL 16", "Stores user & order data")' },
      { element: 'ContainerQueue(id, "Label", "Technology", "Description")', description: 'Defines a message queue or streaming broker container.', example: 'ContainerQueue(mq, "Event Bus", "Apache Kafka", "Order events")' },
      { element: 'Container_Boundary(id, "Label") { ... }', description: 'Groups containers belonging to a software system.', example: 'Container_Boundary(c1, "Store System") {\n  Container(api, "API", "Node.js")\n}' },
    ],
    connectorsOrRelationships: [
      { operator: 'Rel(from, to, "Label", "Technology")', description: 'Connects actors, containers, and external systems.', example: 'Rel(spa, api, "Calls REST endpoints", "JSON/HTTPS")' },
    ],
    commonPitfalls: [
      'Always wrap multi-word arguments in double quotes.',
      'Ensure every `Container_Boundary(...) {` has a matching closing `}`.',
    ],
    minimalExample: `C4Container
  Container(spa, "Web App", "React", "Frontend UI")
  ContainerDb(db, "Database", "PostgreSQL", "Persistent storage")
  Rel(spa, db, "Reads/Writes", "SQL")`,
    fullExample: `C4Container
  Person(user, "Customer", "Buyer")
  Container_Boundary(sys, "E-Commerce Platform") {
    Container(web, "Web Frontend", "Next.js", "Serves storefront")
    Container(api, "Order API", "Go / gRPC", "Processes checkout and orders")
    ContainerDb(db, "Orders DB", "PostgreSQL", "Stores orders")
    ContainerQueue(queue, "Order Queue", "RabbitMQ", "Async fulfillment events")
  }
  Rel(user, web, "Visits", "HTTPS")
  Rel(web, api, "Submits cart", "REST/HTTPS")
  Rel(api, db, "Reads/Writes", "TCP")
  Rel(api, queue, "Publishes OrderPlaced", "AMQP")`,
  },

  'C4Component': {
    diagramType: 'C4Component',
    name: 'C4 Component Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`C4Component` as the first line (case-sensitive).',
    syntaxElements: [
      { element: 'Component(id, "Label", "Technology", "Description")', description: 'Defines an internal module, controller, or service inside a container.', example: 'Component(authCtrl, "Auth Controller", "Express Router", "Handles login")' },
      { element: 'Container_Boundary(id, "Label") { ... }', description: 'Encloses internal components within their parent container.', example: 'Container_Boundary(api, "API Application") {\n  Component(ctrl, "Controller", "REST")\n}' },
    ],
    connectorsOrRelationships: [
      { operator: 'Rel(from, to, "Label", "Technology")', description: 'Shows method calls or data access between components.', example: 'Rel(authCtrl, userRepo, "Finds user by email")' },
    ],
    commonPitfalls: [
      'Every component must have a unique identifier `id` without spaces.',
    ],
    minimalExample: `C4Component
  Component(ctrl, "Order Controller", "Spring MVC", "REST endpoint")
  Component(svc, "Order Service", "Spring Bean", "Business logic")
  Rel(ctrl, svc, "Invokes")`,
    fullExample: `C4Component
  Container_Boundary(api, "API Container") {
    Component(signController, "Sign In Controller", "ASP.NET Core", "Allows users to sign in")
    Component(securityComp, "Security Component", "Spring Security", "Validates credentials")
    Component(userRepo, "User Repository", "Entity Framework", "Reads user records")
  }
  ContainerDb(db, "User Database", "PostgreSQL", "Stores credentials and roles")

  Rel(signController, securityComp, "Delegates authentication")
  Rel(securityComp, userRepo, "Queries user")
  Rel(userRepo, db, "SELECT * FROM users", "TCP/SQL")`,
  },

  'C4Dynamic': {
    diagramType: 'C4Dynamic',
    name: 'C4 Dynamic Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`C4Dynamic` as the first line (case-sensitive).',
    syntaxElements: [
      { element: 'Container(id, "Label", "Technology", "Description")', description: 'Declares a participating container in the runtime interaction.', example: 'Container(spa, "SPA", "React", "Browser client")' },
      { element: 'Component(id, "Label", "Technology", "Description")', description: 'Declares a participating component in the runtime interaction.', example: 'Component(auth, "Auth Service", "JWT", "Token issuer")' },
    ],
    connectorsOrRelationships: [
      { operator: 'Rel(from, to, "Action", "Tech")', description: 'Automatically numbered runtime interaction step.', example: 'Rel(spa, auth, "Submits credentials", "HTTPS")' },
      { operator: 'RelIndex(n, from, to, "Action")', description: 'Explicitly numbered interaction step.', example: 'RelIndex(1, spa, auth, "POST /login")' },
    ],
    commonPitfalls: [
      'Declare all participating elements before referencing their IDs in `Rel(...)`.',
    ],
    minimalExample: `C4Dynamic
  Container(spa, "Frontend", "React")
  Container(api, "Backend", "Node.js")
  Rel(spa, api, "Submits order", "HTTPS")`,
    fullExample: `C4Dynamic
  title Dynamic Diagram for User Authentication
  Person(user, "Customer", "End user")
  Container(spa, "Single-Page App", "React", "UI")
  Container_Boundary(api, "API Gateway") {
    Component(auth, "Auth Controller", "Node.js", "Handles login")
    Component(token, "Token Provider", "JWT", "Signs tokens")
  }
  ContainerDb(db, "User DB", "PostgreSQL", "User credentials")

  Rel(user, spa, "Enters credentials")
  Rel(spa, auth, "POST /auth/login", "HTTPS")
  Rel(auth, db, "Verifies hash", "SQL")
  Rel(auth, token, "Issues JWT")`,
  },

  'C4Deployment': {
    diagramType: 'C4Deployment',
    name: 'C4 Deployment Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`C4Deployment` as the first line (case-sensitive).',
    syntaxElements: [
      { element: 'Deployment_Node(id, "Label", "Type") { ... }', description: 'Defines physical/virtual infrastructure (cloud region, VPC, Kubernetes cluster, EC2 instance).', example: 'Deployment_Node(aws, "AWS us-east-1", "Region") {\n  Container(api, "API", "Docker")\n}' },
      { element: 'Container(id, "Label", "Tech", "Desc")', description: 'Places a deployed software container inside a deployment node.', example: 'Container(api, "Order Service", "Node.js", "REST API")' },
      { element: 'ContainerDb(id, "Label", "Tech", "Desc")', description: 'Places a database instance inside a deployment node.', example: 'ContainerDb(rds, "Aurora PostgreSQL", "RDS", "Primary store")' },
    ],
    connectorsOrRelationships: [
      { operator: 'Rel(from, to, "Label", "Protocol")', description: 'Network communication path between deployed containers.', example: 'Rel(api, rds, "Reads/Writes", "TLS 1.3 / Port 5432")' },
    ],
    commonPitfalls: [
      'Ensure all nested `Deployment_Node(...) {` blocks have matching closing `}` braces.',
    ],
    minimalExample: `C4Deployment
  Deployment_Node(aws, "AWS Cloud", "Region") {
    Deployment_Node(ecs, "ECS Cluster", "Fargate") {
      Container(api, "API Service", "Node.js", "Handles requests")
    }
  }`,
    fullExample: `C4Deployment
  title Production AWS Deployment
  Deployment_Node(aws, "AWS us-east-1", "Cloud Region") {
    Deployment_Node(alb, "Public Subnet", "ALB") {
      Container(cdn, "Ingress Router", "NGINX", "TLS termination")
    }
    Deployment_Node(eks, "Private App Subnet", "EKS Cluster") {
      Container(api, "Core API", "Go Pod", "Business services")
    }
    Deployment_Node(data, "Isolated Data Subnet", "AWS RDS") {
      ContainerDb(pg, "Primary DB", "PostgreSQL 16", "Multi-AZ")
    }
  }
  Rel(cdn, api, "Forwards traffic", "HTTP/2")
  Rel(api, pg, "Queries", "PostgreSQL Wire Protocol")`,
  },

  'packet-beta': {
    diagramType: 'packet-beta',
    name: 'Packet Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`packet-beta` or `packet` as the first line.',
    syntaxElements: [
      { element: 'start-end: "Field Name"', description: 'Declares a multi-bit field spanning from bit `start` to bit `end` (inclusive, 0-indexed).', example: '0-15: "Source Port"\n16-31: "Destination Port"' },
      { element: 'bit: "Flag Name"', description: 'Declares a single-bit flag at the specified bit index.', example: '106: "URG"\n107: "ACK"' },
      { element: '+count: "Field Name"', description: 'Declares a field of `count` bits starting immediately after the previous field.', example: '+16: "Source Port"\n+16: "Destination Port"' },
    ],
    commonPitfalls: [
      'Bit ranges must always be written in ascending order (`0-15`, never `15-0`) and should not overlap.',
      'Field names must be enclosed in double quotes after the colon.',
    ],
    minimalExample: `packet-beta
0-15: "Source Port"
16-31: "Destination Port"
32-63: "Sequence Number"`,
    fullExample: `packet-beta
title UDP & Custom Header Layout
0-15: "Source Port"
16-31: "Destination Port"
32-47: "Length"
48-63: "Checksum"
64-71: "Version & Flags"
72-95: "Session Identifier"
96-127: "Payload Data (32 bits)"`,
  },

  'block-beta': {
    diagramType: 'block-beta',
    name: 'Block Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`block-beta` or `block` as the first line.',
    syntaxElements: [
      { element: 'columns N', description: 'Sets the number of grid columns for automatic block wrapping.', example: 'columns 3' },
      { element: 'id["Label"]:span', description: 'Declares a block optionally spanning `span` columns.', example: 'Header["System Header"]:3' },
      { element: 'block:groupId:span ... end', description: 'Creates a composite nested block group spanning `span` columns.', example: 'block:compute:2\n  columns 2\n  CPU GPU\nend' },
      { element: 'space', description: 'Inserts an empty grid cell spacer (`space` or `space:2`).', example: 'A space B' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Draws a directed connector between two block IDs.', example: 'Input --> Processor' },
      { operator: '---', description: 'Draws an undirected link between two block IDs.', example: 'CPU --- Memory' },
    ],
    commonPitfalls: [
      'Every nested `block:id ...` container MUST be closed with `end`.',
      'Wrap labels containing spaces or punctuation in `["..."]`.',
    ],
    minimalExample: `block-beta
  columns 3
  A["Input"] B["Processor"]:2
  C["Output"]:3`,
    fullExample: `block-beta
  columns 3
  Frontend["Web & Mobile Clients"]:3
  space:3
  Gateway["API Gateway"]:3
  space:3
  Auth["Auth Service"] Orders["Order Service"] Payments["Payment Service"]
  space:3
  DB[("Primary Database")]:2 Cache[("Redis Cache")]

  Frontend --> Gateway
  Gateway --> Auth
  Gateway --> Orders
  Gateway --> Payments
  Orders --> DB
  Orders --> Cache`,
  },

  'flowchart-elk': {
    diagramType: 'flowchart-elk',
    name: 'Flowchart (ELK Layout)',
    category: 'Architecture & Systems',
    headerRequirement: '`flowchart-elk` as the first line (or `flowchart TD` with ELK layout config).',
    syntaxElements: [
      { element: 'id["Label"]', description: 'Declares a flowchart node laid out by the Eclipse Layout Kernel (ELK).', example: 'API["API Gateway"]' },
      { element: 'subgraph id["Title"] ... end', description: 'Declares a hierarchical compound node cluster.', example: 'subgraph vpc["VPC Cluster"]\n  A --> B\nend' },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Orthogonally routed directed edge.', example: 'A --> B' },
      { operator: '-->|label|', description: 'Labeled directed edge.', example: 'A -->|HTTPS| B' },
    ],
    commonPitfalls: [
      'Quote node labels that contain parentheses or special characters: `id["Service (v2)"]`.',
      'Close every `subgraph` with `end`.',
    ],
    minimalExample: `flowchart-elk
  A[Source] --> B[Router]
  B --> C[Destination]`,
    fullExample: `flowchart-elk
  Client["Client App"] --> CDN["Edge CDN"]
  CDN --> ALB["Load Balancer"]

  subgraph Cluster ["Kubernetes Production"]
    ALB --> Web1["Web Pod 1"]
    ALB --> Web2["Web Pod 2"]
    Web1 --> DB[("PostgreSQL")]
    Web2 --> DB
  end`,
  },

  'eventmodeling': {
    diagramType: 'eventmodeling',
    name: 'Event Modeling Diagram',
    category: 'Architecture & Systems',
    headerRequirement: '`eventmodeling` as the first line.',
    syntaxElements: [
      { element: 'tf <num> ui <Name>', description: 'Declares a UI / Automation time frame at unique step number `<num>`.', example: 'tf 01 ui CheckoutScreen' },
      { element: 'tf <num> cmd <Name>', description: 'Declares a Command time frame in the Command/Read Model lane.', example: 'tf 02 cmd PlaceOrder' },
      { element: 'tf <num> evt <Name>', description: 'Declares a Domain Event time frame in the Events lane.', example: 'tf 03 evt OrderPlaced' },
      { element: 'tf <num> rmo <Name>', description: 'Declares a Read Model / View time frame.', example: 'tf 04 rmo OrderSummaryView' },
      { element: 'rf <num> evt <Name>', description: 'Declares a Reset Frame that stops automatic sequential arrow inference from the previous frame.', example: 'rf 05 evt InventoryUpdated' },
    ],
    connectorsOrRelationships: [
      { operator: '->> <frameNum>', description: 'Explicitly connects a frame from an earlier time frame number.', example: 'rf 04 rmo CartView ->> 01 ->> 03' },
    ],
    commonPitfalls: [
      'CRITICAL: Each `tf` or `rf` frame MUST have a unique frame number (e.g. `01`, `02`, `03`). Reusing a frame number causes a parse error.',
      'Entity types must be one of: `ui`, `pcr` (`processor`), `cmd` (`command`), `rmo` (`readmodel`), or `evt` (`event`).',
    ],
    minimalExample: `eventmodeling
  tf 01 ui CartUI
  tf 02 cmd AddItem
  tf 03 evt ItemAdded`,
    fullExample: `eventmodeling
  tf 01 ui CartScreen
  tf 02 cmd AddItem { sku: string, qty: number }
  tf 03 evt ItemAdded { sku: string, qty: number }
  tf 04 rmo CartReadModel
  tf 05 ui CheckoutScreen
  tf 06 cmd SubmitOrder
  tf 07 evt OrderSubmitted`,
  },

  'wardley-beta': {
    diagramType: 'wardley-beta',
    name: 'Wardley Map',
    category: 'Architecture & Systems',
    headerRequirement: '`wardley-beta` as the first line.',
    syntaxElements: [
      { element: 'anchor Name [visibility, evolution]', description: 'Defines a user need anchor at `[visibility, evolution]` coordinates (`0.0` to `1.0`).', example: 'anchor Customer [0.95, 0.60]' },
      { element: 'component Name [visibility, evolution]', description: 'Places a value-chain component at `[visibility, evolution]` (`0.0` to `1.0`) with optional `(build|buy|outsource|market|inertia)` decorator.', example: 'component "API Gateway" [0.70, 0.65] (buy)' },
      { element: 'evolve Name targetEvolution', description: 'Draws a dashed red evolution arrow moving a component rightward to `targetEvolution`.', example: 'evolve "API Gateway" 0.85' },
      { element: 'note "Text" [visibility, evolution]', description: 'Places an explanatory annotation on the map.', example: 'note "Standardize on cloud" [0.35, 0.70]' },
    ],
    connectorsOrRelationships: [
      { operator: '->', description: 'Value-chain dependency from higher-visibility need to lower-visibility component.', example: 'Customer -> "API Gateway"' },
      { operator: '+>', description: 'Flow link with directional marker.', example: '"Web App" +> "API Gateway"' },
    ],
    commonPitfalls: [
      'CRITICAL: Coordinates use OnlineWardleyMaps order `[visibility (Y), evolution (X)]`, where both numbers are between `0.0` and `1.0`.',
      'Look `handDrawn` is not supported on Wardley maps; use `classic` or `neo`.',
    ],
    minimalExample: `wardley-beta
  anchor User [0.95, 0.50]
  component WebApp [0.75, 0.45]
  component Database [0.40, 0.80]
  User -> WebApp
  WebApp -> Database`,
    fullExample: `wardley-beta
  title SaaS Platform Strategy
  anchor Customer [0.95, 0.65]
  component "Web Portal" [0.80, 0.55] (build)
  component "AI Copilot" [0.72, 0.25] (build)
  component "Auth Service" [0.55, 0.75] (buy)
  component "PostgreSQL RDS" [0.35, 0.85] (outsource)
  component "Cloud Compute" [0.15, 0.92] (market)

  Customer -> "Web Portal"
  Customer -> "AI Copilot"
  "Web Portal" -> "Auth Service"
  "AI Copilot" -> "PostgreSQL RDS"
  "Auth Service" -> "PostgreSQL RDS"
  "PostgreSQL RDS" -> "Cloud Compute"
  evolve "AI Copilot" 0.55`,
  },

  'gantt': {
    diagramType: 'gantt',
    name: 'Gantt Chart',
    category: 'Project Planning',
    headerRequirement: '`gantt` as the first line, followed by `dateFormat YYYY-MM-DD`.',
    syntaxElements: [
      { element: 'dateFormat YYYY-MM-DD', description: 'Defines the input date format for task start/end dates.', example: 'dateFormat YYYY-MM-DD' },
      { element: 'section Section Title', description: 'Groups tasks into horizontal project phase bands.', example: 'section Phase 1: Discovery' },
      { element: 'Task Name : [tags], [id], [start], [duration/end]', description: 'Defines a task with optional status tags (`done`, `active`, `crit`, `milestone`), task ID, start date or `after <id>`, and duration (`7d`, `2w`).', example: 'API Spec : done, spec, 2026-01-01, 5d\nBackend  : active, dev, after spec, 10d' },
    ],
    commonPitfalls: [
      'Task names cannot contain colons `:` because `:` separates the task label from its metadata.',
      'When using `after taskId`, make sure `taskId` was explicitly assigned on the referenced task.',
    ],
    minimalExample: `gantt
  dateFormat YYYY-MM-DD
  title Sprint Schedule
  section Development
  Design : des, 2026-01-01, 5d
  Coding : after des, 10d`,
    fullExample: `gantt
  dateFormat YYYY-MM-DD
  title Product Launch Roadmap
  section Architecture
    System Design       : done, des1, 2026-02-01, 7d
    Security Review     : active, sec1, after des1, 5d
  section Implementation
    Backend Services    : crit, dev1, after sec1, 14d
    Frontend Dashboard  : dev2, after des1, 14d
  section Release
    QA & Load Testing   : qa1, after dev1, 7d
    Production Launch   : milestone, m1, after qa1, 0d`,
  },

  'timeline': {
    diagramType: 'timeline',
    name: 'Timeline Diagram',
    category: 'Project Planning',
    headerRequirement: '`timeline` as the first line.',
    syntaxElements: [
      { element: 'title Timeline Title', description: 'Sets the header title of the timeline.', example: 'title Company Milestones' },
      { element: 'section Era Name', description: 'Optionally groups periods into colored thematic sections.', example: 'section Foundation' },
      { element: 'Period : Event 1 : Event 2', description: 'Declares a time period followed by one or more colon-separated events (or indented `: Event` lines).', example: '2026 Q1 : Seed Round : MVP Launch' },
    ],
    commonPitfalls: [
      'Avoid using literal colons `:` inside event text, as `:` is the delimiter between period and events.',
    ],
    minimalExample: `timeline
  title Product Roadmap
  2026 Q1 : Alpha Release : Design System
  2026 Q2 : Public Beta`,
    fullExample: `timeline
  title Platform Evolution Roadmap
  section Foundation
    2026 Q1 : Core Engine v1 : Auth & RBAC
    2026 Q2 : Multi-Region DB : Public Beta
  section Scale & AI
    2026 Q3 : AI Agent Workflows : SOC2 Compliance
    2026 Q4 : Enterprise GA : Global CDN`,
  },

  kanban: {
    diagramType: 'kanban',
    name: 'Kanban Board',
    category: 'Project Planning & Management',
    headerRequirement: 'Must begin with `kanban` on the first line.',
    syntaxElements: [
      {
        element: 'Columns & Indented Cards',
        description: 'Define columns at root indentation (`colId[Column Title]`) and cards indented inside them (`cardId[Card Description]`).',
        example: `  todo[To Do]
    t1[Design API Schema]
    t2[Setup CI Pipeline]`,
      },
      {
        element: 'Card Metadata (`@{ ... }`)',
        description: 'Attach metadata like `assigned`, `ticket`, and `priority` (`Very High`, `High`, `Low`, `Very Low`) to cards.',
        example: `    t1[Fix Auth Bug]@{ assigned: 'alice', ticket: 'PROJ-104', priority: 'High' }`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Cards must be indented underneath their parent column using consistent spaces.',
      'Priority values in `@{ priority: ... }` must match supported strings (`Very High`, `High`, `Low`, `Very Low`).',
    ],
    minimalExample: `kanban
  todo[To Do]
    id1[Design Database]
  done[Done]
    id2[Project Kickoff]`,
    fullExample: `kanban
  backlog[Backlog]
    b1[Multi-Region Replication]@{ ticket: 'PLAT-201', priority: 'Low' }
  inprog[In Progress]
    p1[Implement OAuth2 PKCE]@{ assigned: 'alice', ticket: 'PLAT-142', priority: 'Very High' }
    p2[Rate Limiter Middleware]@{ assigned: 'bob', ticket: 'PLAT-145', priority: 'High' }
  review[Code Review]
    r1[OpenTelemetry Tracing]@{ assigned: 'charlie', ticket: 'PLAT-138' }
  done[Done]
    d1[PostgreSQL 16 Upgrade]@{ assigned: 'alice', ticket: 'PLAT-110' }`,
  },

  gitGraph: {
    diagramType: 'gitGraph',
    name: 'Git Graph',
    category: 'Project Planning & Management',
    headerRequirement: 'Must begin with `gitGraph` (case-sensitive capital `G`, or `gitGraph TB:`).',
    syntaxElements: [
      {
        element: 'Commits (`commit`)',
        description: 'Create commits with optional `id:`, `tag:`, and `type:` (`NORMAL`, `REVERSE`, `HIGHLIGHT`).',
        example: `  commit id: "init" tag: "v1.0.0"
  commit id: "hotfix" type: HIGHLIGHT`,
      },
      {
        element: 'Branches (`branch` & `checkout`)',
        description: 'Create a new branch with `branch <name>` and switch between branches with `checkout <name>` (or `switch <name>`).',
        example: `  branch feature/auth
  checkout feature/auth
  commit id: "add-jwt"`,
      },
      {
        element: 'Merging & Cherry-Picking',
        description: 'Merge branches with `merge <branch>` (supports `id:`, `tag:`, `type:`) or cherry-pick a commit by ID with `cherry-pick id: "<id>"`.',
        example: `  checkout main
  merge feature/auth id: "merge-auth" tag: "v1.1.0"`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'You cannot `merge` or `checkout` a branch that has not yet been created with `branch <name>` (except `main`).',
      '`cherry-pick id: "..."` requires the target commit to have been declared with an explicit `id: "..."`.',
    ],
    minimalExample: `gitGraph
  commit id: "init"
  branch feature
  checkout feature
  commit id: "feat-1"
  checkout main
  merge feature`,
    fullExample: `gitGraph
  commit id: "initial" tag: "v1.0.0"
  branch develop
  checkout develop
  commit id: "core-setup"
  branch feature/payments
  checkout feature/payments
  commit id: "stripe-sdk"
  commit id: "webhook-handler" type: HIGHLIGHT
  checkout develop
  merge feature/payments id: "merge-payments"
  checkout main
  merge develop tag: "v1.1.0"`,
  },

  journey: {
    diagramType: 'journey',
    name: 'User Journey',
    category: 'Project Planning & Management',
    headerRequirement: 'Must begin with `journey` on the first line.',
    syntaxElements: [
      {
        element: 'Title & Sections',
        description: 'Set a journey title with `title` and group phases using `section <Phase Name>`.',
        example: `  title Customer Onboarding Journey
  section Sign Up`,
      },
      {
        element: 'Task Scoring (`Task : Score : Actors`)',
        description: 'Format tasks as `<Task Name>: <Score 1-5>: <Comma-separated Actors>`.',
        example: `    Verify Email: 4: User, System
    Complete Profile: 3: User`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Scores must be integers between `1` (very negative) and `5` (very positive).',
      'Do not use extra colons inside the task name; colons strictly separate Task, Score, and Actors.',
    ],
    minimalExample: `journey
  title Onboarding
  section Registration
    Visit Website: 5: User
    Fill Form: 3: User`,
    fullExample: `journey
  title Cloud Platform Trial-to-Paid Journey
  section Discovery
    Read Documentation: 5: Developer
    Run Quickstart CLI: 5: Developer
  section Integration
    Configure Webhook: 3: Developer, Platform
    Debug Sandbox Error: 2: Developer, Support
  section Purchase
    Enter Billing Info: 4: Buyer
    Provision Production Cluster: 5: Developer, Platform`,
  },

  pie: {
    diagramType: 'pie',
    name: 'Pie Chart',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `pie` (or `pie showData` to display raw values next to percentages).',
    syntaxElements: [
      {
        element: 'Title & Slice Entries',
        description: 'Specify an optional `title` and list each slice as `"<Label>" : <positive number>`.',
        example: `pie showData
  title Cloud Spend Breakdown
  "Compute" : 52.5
  "Database" : 27.5
  "Networking" : 20`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Slice labels MUST be enclosed in double quotes `"Label"` followed by `:` and a positive numeric value.',
      'Zero or negative values are rejected by the pie chart parser.',
    ],
    minimalExample: `pie title Traffic Sources
  "Organic Search" : 60
  "Direct" : 25
  "Referral" : 15`,
    fullExample: `pie showData
  title Monthly Infrastructure Cost by Category ($)
  "Kubernetes Compute" : 4200
  "Managed PostgreSQL" : 1850
  "Object Storage & CDN" : 950
  "Observability & Logs" : 650
  "CI/CD Runners" : 350`,
  },

  quadrantChart: {
    diagramType: 'quadrantChart',
    name: 'Quadrant Chart',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `quadrantChart` (case-sensitive capital `C`).',
    syntaxElements: [
      {
        element: 'Axes & Quadrant Labels',
        description: 'Define axes (`x-axis Left --> Right`, `y-axis Bottom --> Top`) and labels for `quadrant-1` (top-right), `quadrant-2` (top-left), `quadrant-3` (bottom-left), `quadrant-4` (bottom-right).',
        example: `  x-axis Low Effort --> High Effort
  y-axis Low Impact --> High Impact
  quadrant-1 Strategic Bets
  quadrant-2 Quick Wins`,
      },
      {
        element: 'Data Points (`Name: [x, y]`)',
        description: 'Plot points using normalized `[x, y]` coordinates where both `x` and `y` are decimals between `0.0` and `1.0`.',
        example: `  AI Search: [0.30, 0.85]
  Legacy Rewrite: [0.85, 0.40]`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Coordinates `[x, y]` MUST be normalized decimals in `[0.0, 1.0]` (e.g. `[0.75, 0.40]`); values > 1 will fail.',
      '`x-axis` and `y-axis` require the `-->` arrow separator when specifying both low and high labels.',
    ],
    minimalExample: `quadrantChart
  title Prioritization Matrix
  x-axis Low Effort --> High Effort
  y-axis Low Impact --> High Impact
  quadrant-1 Major Projects
  quadrant-2 Quick Wins
  quadrant-3 Fill-ins
  quadrant-4 Thankless Tasks
  Feature A: [0.25, 0.80]
  Feature B: [0.75, 0.65]`,
    fullExample: `quadrantChart
  title Engineering Initiative Prioritization
  x-axis Low Implementation Complexity --> High Implementation Complexity
  y-axis Low Business Value --> High Business Value
  quadrant-1 Strategic Investments
  quadrant-2 High-ROI Quick Wins
  quadrant-3 Low-Priority Maintenance
  quadrant-4 Over-Engineered Traps
  Smart Dark Theme: [0.20, 0.85]
  Catalog Syntax Guides: [0.35, 0.90]
  Multi-Region Failover: [0.80, 0.88]
  Custom Font Loader: [0.65, 0.30]
  Update README Badges: [0.15, 0.25]`,
  },

  'xychart-beta': {
    diagramType: 'xychart-beta',
    name: 'XY Chart (Bar & Line)',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `xychart-beta` (or `xychart-beta horizontal`).',
    syntaxElements: [
      {
        element: 'Axes (`x-axis` & `y-axis`)',
        description: 'Configure categorical `x-axis [cat1, cat2, ...]` (or numeric range `min --> max`) and numeric `y-axis "Title" min --> max`.',
        example: `  x-axis ["Q1", "Q2", "Q3", "Q4"]
  y-axis "Revenue ($K)" 0 --> 500`,
      },
      {
        element: 'Bar & Line Series',
        description: 'Plot one or more `bar [...]` and `line [...]` numeric arrays matching the length of categorical x-axis items.',
        example: `  bar [180, 240, 310, 420]
  line [160, 220, 290, 400]`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Category names containing spaces or punctuation in `x-axis [...]` must be enclosed in double quotes.',
      'The number of data points in `bar [...]` and `line [...]` should match the number of categories on `x-axis`.',
    ],
    minimalExample: `xychart-beta
  title "Quarterly Revenue"
  x-axis [Q1, Q2, Q3, Q4]
  y-axis "USD (Thousands)" 0 --> 100
  bar [30, 50, 75, 90]
  line [25, 45, 70, 88]`,
    fullExample: `xychart-beta
  title "API Throughput vs P95 Latency"
  x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  y-axis "Requests / sec" 0 --> 5000
  bar [1800, 2200, 2750, 3400, 4100, 4650]
  line [1500, 1950, 2600, 3100, 3900, 4500]`,
  },

  'sankey-beta': {
    diagramType: 'sankey-beta',
    name: 'Sankey Diagram',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `sankey-beta` on the first line.',
    syntaxElements: [
      {
        element: 'CSV Flow Triplets (`source,target,value`)',
        description: 'Each line after `sankey-beta` is a 3-column CSV row: `Source Node,Target Node,Numeric Value`.',
        example: `sankey-beta
Solar,Grid,120
Wind,Grid,80
Grid,Homes,150
Grid,Industry,50`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Do not use arrow operators (`-->`) in `sankey-beta`; every line must have exactly 3 comma-separated fields.',
      'Wrap node names containing commas in double quotes `"Node, Inc.",Target,50`.',
    ],
    minimalExample: `sankey-beta
Traffic,Landing Page,1000
Landing Page,Sign Up,350
Landing Page,Bounce,650`,
    fullExample: `sankey-beta
Organic Search,Product Page,4500
Paid Ads,Product Page,2500
Referral,Product Page,1000
Product Page,Add to Cart,2400
Product Page,Exit,5600
Add to Cart,Checkout,1500
Add to Cart,Abandoned,900
Checkout,Completed Order,1200
Checkout,Payment Failed,300`,
  },

  mindmap: {
    diagramType: 'mindmap',
    name: 'Mindmap',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `mindmap` on the first line.',
    syntaxElements: [
      {
        element: 'Single Root & Indented Hierarchy',
        description: 'Define exactly one root node indented below `mindmap`, and nest child branches using consistent space indentation.',
        example: `mindmap
  root((System Design))
    Scalability
      Load Balancing
      Caching`,
      },
      {
        element: 'Node Shapes',
        description: 'Use `[Square]`, `(Rounded)`, `((Circle))`, `))Bang((`, `)Cloud(`, or `{{Hexagon}}`.',
        example: `    Security{{Security}}
      OAuth2(OAuth 2.0)
      mTLS[Mutual TLS]`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'A `mindmap` must have only ONE root node; multiple top-level nodes at the same root indentation will cause a parse error.',
      'Use consistent spaces for indentation (avoid mixing tabs and spaces).',
    ],
    minimalExample: `mindmap
  root((Cloud Native))
    Containers
      Docker
      Kubernetes
    Observability
      Metrics
      Traces`,
    fullExample: `mindmap
  root((AI Engineering Platform))
    Model Serving
      vLLM Cluster
      Quantization
      Autoscaling
    RAG Pipeline
      Document Chunking
      Vector Database
      Hybrid Reranker
    Guardrails{{Safety & Eval}}
      PII Redaction
      Hallucination Checks
    Observability
      Token Cost Tracking
      Latency Tracing`,
  },

  'radar-beta': {
    diagramType: 'radar-beta',
    name: 'Radar Chart',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `radar-beta` on the first line.',
    syntaxElements: [
      {
        element: 'Axes Declaration (`axis`)',
        description: 'Declare radar axes with `axis id["Label"]` (multiple axes can be comma-separated on one line or across lines).',
        example: `  axis A["Speed"], B["Reliability"], C["Security"], D["DX"], E["Scalability"]`,
      },
      {
        element: 'Data Curves (`curve`)',
        description: 'Plot each series with `curve id["Label"]{v1, v2, ...}` (positional values in curly braces) or `{A: 80, B: 90}`.',
        example: `  curve v1["Current"]{75, 85, 90, 70, 80}
  curve v2["Target"]{90, 95, 95, 90, 95}`,
      },
      {
        element: 'Chart Options (`max`, `min`, `graticule`, `ticks`)',
        description: 'Customize scale and grid style (`graticule polygon` or `graticule circle`, `max 100`, `min 0`, `showLegend true`).',
        example: `  max 100
  min 0
  graticule polygon`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Curve values MUST be enclosed in curly braces `{v1, v2, ...}`, NOT square brackets `[...]`.',
      'Every `curve` must provide a value for every declared `axis`.',
    ],
    minimalExample: `radar-beta
  title "Service Maturity"
  axis A["Speed"], B["Reliability"], C["Security"], D["Cost"]
  curve c1["Service A"]{80, 90, 85, 70}
  max 100`,
    fullExample: `radar-beta
  title "Architecture Readiness Assessment"
  axis perf["Performance"], rel["Reliability"], sec["Security"], obs["Observability"], dx["Developer UX"]
  curve cur["v1.0 Baseline"]{65, 70, 80, 55, 60}
  curve tgt["v2.0 Release"]{90, 95, 92, 88, 90}
  max 100
  min 0
  graticule polygon`,
  },

  'venn-beta': {
    diagramType: 'venn-beta',
    name: 'Venn Diagram',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `venn-beta` on the first line.',
    syntaxElements: [
      {
        element: 'Sets (`set`)',
        description: 'Declare sets using `set ID["Label"]` or with an explicit relative size `set ID["Label"]:20`.',
        example: `  set A["Frontend"]:20
  set B["Backend"]:20`,
      },
      {
        element: 'Intersections (`union`)',
        description: 'Declare overlapping regions between 2 or more sets using `union A,B["Shared Label"]` or `union A,B["Label"]:5`.',
        example: `  union A,B["Fullstack"]:8`,
      },
      {
        element: 'Nested Text Nodes (`text`)',
        description: 'Place child labels inside a `set` or `union` by indenting `text id["Label"]` underneath it.',
        example: `  set A["Frontend"]
    text t1["React"]`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Mermaid v12.3.0 uses the `union A,B["Label"]` keyword to represent set intersections/overlaps (there is no `intersection` keyword).',
      'Every set identifier referenced in `union A,B` must first be declared with `set A` and `set B`.',
    ],
    minimalExample: `venn-beta
  title "Team Overlap"
  set A["Frontend"]
  set B["Backend"]
  union A,B["Fullstack"]`,
    fullExample: `venn-beta
  title "DevSecOps Skill Matrix"
  set Dev["Software Engineering"]:20
    text d1["TypeScript"]
  set Ops["Cloud Infrastructure"]:20
    text o1["Kubernetes"]
  set Sec["Security Engineering"]:20
    text s1["Threat Modeling"]
  union Dev,Ops["SRE"]:6
  union Dev,Sec["AppSec"]:6
  union Ops,Sec["CloudSec"]:6
  union Dev,Ops,Sec["DevSecOps"]:3`,
  },

  treemap: {
    diagramType: 'treemap',
    name: 'Treemap Diagram',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `treemap-beta` (or `treemap`) on the first line.',
    syntaxElements: [
      {
        element: 'Branch / Section Nodes',
        description: 'Define parent containers using a double-quoted name `"Section Name"` without a colon or value, and indent children beneath it.',
        example: `treemap-beta
"Engineering"
  "Backend"
    "API Servers": 45`,
      },
      {
        element: 'Leaf Nodes (`"Name": value`)',
        description: 'Define leaf nodes with a double-quoted label, a colon `:`, and a numeric weight.',
        example: `    "Worker Nodes": 30
    "Cache Layer": 25`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Both section names and leaf labels MUST be enclosed in double quotes `"..."`.',
      'Only leaf nodes take `: <value>`; parent branch nodes must NOT have a colon or numeric value.',
    ],
    minimalExample: `treemap-beta
"Cloud Budget"
  "Compute"
    "Kubernetes": 50
    "Serverless": 20
  "Storage"
    "PostgreSQL": 30`,
    fullExample: `treemap-beta
"Annual R&D Allocation ($K)"
  "Platform Engineering"
    "Kubernetes Fleet": 420
    "Observability Stack": 180
    "CI/CD Infrastructure": 120
  "AI & Data Systems"
    "GPU Inference Cluster": 550
    "Vector Search Engine": 210
  "Security & Compliance"
    "Zero-Trust IAM": 160
    "Automated Auditing": 90`,
  },

  'ishikawa-beta': {
    diagramType: 'ishikawa-beta',
    name: 'Ishikawa (Fishbone) Diagram',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `ishikawa-beta` on the first line.',
    syntaxElements: [
      {
        element: 'Root Effect & Indented Cause Hierarchy',
        description: 'The first indented line under `ishikawa-beta` is the fish head (effect/problem). Indented children below it are major cause categories, and deeper indentations are sub-causes.',
        example: `ishikawa-beta
  Production Outage
    Infrastructure
      Disk Full
      DNS Timeout
    Code
      Memory Leak`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Do not use arrows (`-->`) or colons (`:`) in `ishikawa-beta`; the hierarchy is defined strictly by space indentation.',
      'Ensure there is a single root problem/effect node at the top indentation level.',
    ],
    minimalExample: `ishikawa-beta
  High API Latency
    Database
      Missing Index
      Lock Contention
    Network
      TLS Handshake Overhead`,
    fullExample: `ishikawa-beta
  Checkout Service 503 Outage
    Database Layer
      Connection Pool Exhausted
      Unindexed Order Query
    Application Code
      Unbounded Retry Loop
      Missing Circuit Breaker
    Infrastructure
      Autoscaler Cooldown Too Long
      Node Memory Pressure
    Release Process
      Load Test Skipped in Staging`,
  },

  'cynefin-beta': {
    diagramType: 'cynefin-beta',
    name: 'Cynefin Framework Diagram',
    category: 'Charts & Visual Analytics',
    headerRequirement: 'Must begin with `cynefin-beta` on the first line.',
    syntaxElements: [
      {
        element: 'Domains (`clear`, `complicated`, `complex`, `chaotic`, `confusion`)',
        description: 'Use lowercase domain keywords and indent double-quoted item strings underneath each domain.',
        example: `  clear
    "Standard SOPs"
  complicated
    "Capacity Planning"
  complex
    "New Market Product"
  chaotic
    "Zero-Day Incident"`,
      },
      {
        element: 'Cross-Domain Transitions',
        description: 'Connect domains with `domainA --> domainB : "Transition Label"` to show movement across boundaries.',
        example: `  chaotic --> complex : "Stabilize"
  complex --> complicated : "Codify Patterns"`,
      },
    ],
    connectorsOrRelationships: [
      { operator: '-->', description: 'Transition between Cynefin domains', example: 'complex --> complicated : "Standardize"' },
    ],
    commonPitfalls: [
      'Domain keywords (`clear`, `complicated`, `complex`, `chaotic`, `confusion`) must be lowercase.',
      'Items indented inside a domain must be enclosed in double quotes `"..."`.',
    ],
    minimalExample: `cynefin-beta
  title "Incident Categorization"
  clear
    "Password Reset"
  complicated
    "Query Tuning"
  complex
    "Architecture Migration"
  chaotic
    "Active Production Outage"`,
    fullExample: `cynefin-beta
  title "Engineering Operations Decision Framework"
  clear
    "Automated SSL Renewal"
    "Standard Runbook Alerts"
  complicated
    "Database Index Optimization"
    "Root Cause Performance Analysis"
  complex
    "AI Agent Workflow Tuning"
    "Canary Feature Experimentation"
  chaotic
    "Cascading Multi-Region Failure"
    "Active Security Breach Containment"
  confusion
    "Unclassified Customer Escalation"
  chaotic --> complex : "Restore Service"
  complex --> complicated : "Extract Learnings"
  complicated --> clear : "Automate Runbook"`,
  },

  'railroad-beta': {
    diagramType: 'railroad-beta',
    name: 'Railroad Syntax Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `railroad-beta` on the first line.',
    syntaxElements: [
      {
        element: 'Rule Definition (`rule = expr ;`)',
        description: 'Assign a rule name to a combinator expression and terminate the statement with a semicolon `;`.',
        example: `  stmt = sequence(terminal("SELECT"), nonterminal("columns")) ;`,
      },
      {
        element: 'Combinators (`sequence`, `choice`, `optional`, `one_or_more`, `zero_or_more`)',
        description: 'Combine `terminal("literal")` and `nonterminal("rule")` primitives using functional railroad constructors.',
        example: `  columns = one_or_more(nonterminal("ident"), terminal(",")) ;`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'Every rule definition in `railroad-beta` MUST end with a semicolon `;`.',
      'String arguments inside `terminal("...")` and `nonterminal("...")` must be double-quoted.',
    ],
    minimalExample: `railroad-beta
  expr = sequence(terminal("SELECT"), nonterminal("fields"), terminal("FROM"), nonterminal("table")) ;`,
    fullExample: `railroad-beta
  title "Select Query Railroad"
  query = sequence(
    terminal("SELECT"),
    optional(terminal("DISTINCT")),
    one_or_more(nonterminal("column"), terminal(",")),
    terminal("FROM"),
    nonterminal("table_name"),
    optional(sequence(terminal("WHERE"), nonterminal("predicate")))
  ) ;`,
  },

  'railroad-ebnf-beta': {
    diagramType: 'railroad-ebnf-beta',
    name: 'Railroad EBNF Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `railroad-ebnf-beta` on the first line.',
    syntaxElements: [
      {
        element: 'EBNF Production Rules (`rule = ... ;`)',
        description: 'Write standard ISO EBNF rules using `=` (or `::=`), `|` for alternation, `[ ... ]` for optional, `{ ... }` for zero-or-more repetition, and `;` to terminate.',
        example: `  ident = letter , { letter | digit } ;
  number = digit , { digit } ;`,
      },
    ],
    connectorsOrRelationships: [
      { operator: '|', description: 'Alternation (choice)', example: '"true" | "false"' },
      { operator: '[ ... ]', description: 'Optional group (0 or 1)', example: '[ "+" | "-" ]' },
      { operator: '{ ... }', description: 'Repetition group (0 or more)', example: '{ digit }' },
    ],
    commonPitfalls: [
      'Every EBNF production rule must end with a semicolon `;`.',
      'Wrap terminal literals in double quotes `"..."` or single quotes `\'...\'`.',
    ],
    minimalExample: `railroad-ebnf-beta
  number = [ "-" ] , digit , { digit } ;
  digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;`,
    fullExample: `railroad-ebnf-beta
  json_object = "{" , [ member , { "," , member } ] , "}" ;
  member = string , ":" , value ;
  value = string | number | json_object | "true" | "false" | "null" ;`,
  },

  'railroad-abnf-beta': {
    diagramType: 'railroad-abnf-beta',
    name: 'Railroad ABNF Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `railroad-abnf-beta` on the first line.',
    syntaxElements: [
      {
        element: 'ABNF Production Rules (`rule = ... ;`)',
        description: 'Write RFC 5234 ABNF rules using `=`, `/` for alternation, `[ ... ]` for optional, `*element` or `1*element` for repetition, and `;` to terminate each rule.',
        example: `  request-line = method SP request-target SP http-version CRLF ;
  method = "GET" / "POST" / "PUT" / "DELETE" ;`,
      },
    ],
    connectorsOrRelationships: [
      { operator: '/', description: 'ABNF alternation (choice)', example: '"GET" / "POST"' },
      { operator: '1*element', description: 'One or more repetitions', example: '1*DIGIT' },
      { operator: '[ ... ]', description: 'Optional sequence', example: '[ "?" query ]' },
    ],
    commonPitfalls: [
      'ABNF uses `/` for alternation (not `|`), and in Mermaid `railroad-abnf-beta` each rule must end with `;`.',
    ],
    minimalExample: `railroad-abnf-beta
  status-line = HTTP-version SP status-code SP reason-phrase ;
  status-code = "200" / "400" / "404" / "500" ;`,
    fullExample: `railroad-abnf-beta
  http-uri = "https://" host [ ":" port ] path [ "?" query ] ;
  host = 1*( ALPHA / DIGIT / "-" / "." ) ;
  port = 1*DIGIT ;
  path = *( "/" segment ) ;`,
  },

  'railroad-peg-beta': {
    diagramType: 'railroad-peg-beta',
    name: 'Railroad PEG Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `railroad-peg-beta` on the first line.',
    syntaxElements: [
      {
        element: 'PEG Parsing Rules (`rule <- ... ;`)',
        description: 'Define Parsing Expression Grammar rules using the `<-` left-arrow assignment operator, `/` for prioritized choice, `?` for optional, `*` for zero-or-more, `+` for one-or-more, and `;` at the end.',
        example: `  Expr <- Term (("+" / "-") Term)* ;
  Term <- Factor (("*" / "/") Factor)* ;`,
      },
    ],
    connectorsOrRelationships: [
      { operator: '<-', description: 'PEG rule assignment operator', example: 'Expr <- Term ;' },
      { operator: '/', description: 'Prioritized choice', example: '"+" / "-"' },
      { operator: '* / + / ?', description: 'Zero-or-more (`*`), one-or-more (`+`), optional (`?`)', example: 'Digit+' },
    ],
    commonPitfalls: [
      'PEG rules MUST use the `<-` operator (not `=`) and terminate each rule with `;`.',
    ],
    minimalExample: `railroad-peg-beta
  Expr <- Term (("+" / "-") Term)* ;
  Term <- [0-9]+ ;`,
    fullExample: `railroad-peg-beta
  Sum <- Product (("+" / "-") Product)* ;
  Product <- Value (("*" / "/") Value)* ;
  Value <- [0-9]+ / "(" Sum ")" ;`,
  },

  requirementDiagram: {
    diagramType: 'requirementDiagram',
    name: 'Requirement Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `requirementDiagram` (case-sensitive capital `D`).',
    syntaxElements: [
      {
        element: 'Requirement Block',
        description: 'Define `requirement` (or `functionalRequirement`, `performanceRequirement`, `interfaceRequirement`, `securityRequirement`) with `id`, `text`, `risk` (`low`|`medium`|`high`), and `verifymethod` (`analysis`|`inspection`|`test`|`demonstration`).',
        example: `  requirement auth_req {
    id: 1.1
    text: System must enforce MFA for admin users
    risk: high
    verifymethod: test
  }`,
      },
      {
        element: 'Design Elements (`element`)',
        description: 'Define implementation artifacts with `type:` and optional `docref:`.',
        example: `  element auth_service {
    type: service
    docref: docs/auth.md
  }`,
      },
    ],
    connectorsOrRelationships: [
      { operator: '- satisfies ->', description: 'Element satisfies a requirement', example: 'auth_service - satisfies -> auth_req' },
      { operator: '- verifies ->', description: 'Test/element verifies a requirement', example: 'e2e_suite - verifies -> auth_req' },
      { operator: '- contains ->', description: 'Parent requirement contains child requirement', example: 'parent_req - contains -> child_req' },
      { operator: '- derives ->', description: 'Requirement derives from another', example: 'sub_req - derives -> main_req' },
    ],
    commonPitfalls: [
      '`risk` must be one of `low`, `medium`, `high` and `verifymethod` must be one of `analysis`, `inspection`, `test`, `demonstration`.',
      'Avoid `<` or `>` characters inside unquoted `text:` values; wrap text with special characters in double quotes.',
    ],
    minimalExample: `requirementDiagram
  requirement req1 {
    id: 1
    text: API responses under 200ms
    risk: medium
    verifymethod: test
  }
  element api_gw {
    type: service
  }
  api_gw - satisfies -> req1`,
    fullExample: `requirementDiagram
  securityRequirement mfa_req {
    id: SEC-01
    text: "Enforce hardware WebAuthn MFA for privileged roles"
    risk: high
    verifymethod: test
  }
  performanceRequirement latency_req {
    id: PERF-01
    text: "Token verification P99 latency under 15ms"
    risk: medium
    verifymethod: demonstration
  }
  element iam_gateway {
    type: microservice
    docref: services/iam-gateway
  }
  element security_audit_suite {
    type: test_suite
    docref: tests/security/mfa.spec.ts
  }
  iam_gateway - satisfies -> mfa_req
  iam_gateway - satisfies -> latency_req
  security_audit_suite - verifies -> mfa_req`,
  },

  'treeView-beta': {
    diagramType: 'treeView-beta',
    name: 'TreeView Diagram',
    category: 'Grammar & Specifications',
    headerRequirement: 'Must begin with `treeView-beta` (case-sensitive capital `V`).',
    syntaxElements: [
      {
        element: 'Indented Directory & File Hierarchy',
        description: 'Define folders (conventionally ending with `/`) and files using space indentation (or `├──` / `└──` box-drawing characters).',
        example: `treeView-beta
  src/
    index.ts
    catalog.ts`,
      },
      {
        element: 'Inline Comments (`## ...`) & Highlights (`:::highlight`)',
        description: 'Append `## Description` after a file or folder name to render an inline annotation.',
        example: `  src/
    renderer.ts ## Puppeteer PNG engine`,
      },
    ],
    connectorsOrRelationships: [],
    commonPitfalls: [
      'The header keyword is case-sensitive: `treeView-beta` (capital `V`).',
      'Ensure there is a single root directory at the top level and consistent space indentation for child items.',
    ],
    minimalExample: `treeView-beta
  project/
    src/
      index.ts
      renderer.ts
    package.json`,
    fullExample: `treeView-beta
  mcp-server-mermaidjs-to-image/
    src/
      index.ts ## MCP Server & Tool Handlers
      catalog.ts ## 40 Diagram Catalog & Syntax Guides
      renderer.ts ## Puppeteer Headless Renderer
      diagnostics.ts ## Error Parser & Remediation Hints
      types.ts ## Zod Schemas & Theme Resolution
    test/
      test-render.ts
      mcp-tools-suite.test.ts
    package.json`,
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
