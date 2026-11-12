import { DiagnosticReport } from './types.js';

export function detectDiagramType(syntax: string): string {
  const lines = syntax.split('\n');
  let inFrontmatter = false;
  let checkedFirstNonEmpty = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!checkedFirstNonEmpty && !line) {
      continue;
    }
    if (!checkedFirstNonEmpty && line === '---') {
      inFrontmatter = true;
      checkedFirstNonEmpty = true;
      continue;
    }
    checkedFirstNonEmpty = true;
    if (inFrontmatter) {
      if (line === '---') {
        inFrontmatter = false;
      }
      continue;
    }
    if (!line || line.startsWith('%%')) {
      continue;
    }
    const firstWord = line.split(/[\s:;{(]/)[0].toLowerCase();
    return firstWord;
  }
  return 'unknown';
}

export function extractLineAndColumn(
  errorMessage: string,
  errorObj?: any
): { line?: number; column?: number } {
  if (errorObj?.hash?.loc?.first_line) {
    return {
      line: Number(errorObj.hash.loc.first_line),
      column: errorObj.hash.loc.first_column ? Number(errorObj.hash.loc.first_column) : undefined,
    };
  }

  // Common Mermaid error formats:
  // "Parse error on line 4:"
  // "Lexical error on line 12. Unrecognized text."
  // "at line 5 column 10"
  const lineMatch = errorMessage.match(/line\s+(\d+)/i);
  const colMatch = errorMessage.match(/col(?:umn)?\s+(\d+)/i);

  const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
  const column = colMatch ? parseInt(colMatch[1], 10) : undefined;

  return { line, column };
}

export function createCodeFrame(syntax: string, targetLine?: number, targetCol?: number): string {
  if (!targetLine || targetLine < 1) {
    return syntax
      .split('\n')
      .slice(0, 15)
      .map((l, i) => `  ${String(i + 1).padStart(3, ' ')} | ${l}`)
      .join('\n');
  }

  const lines = syntax.split('\n');
  const start = Math.max(0, targetLine - 3);
  const end = Math.min(lines.length, targetLine + 2);

  const frameLines: string[] = [];
  for (let i = start; i < end; i++) {
    const lineNum = i + 1;
    const isTarget = lineNum === targetLine;
    const lineContent = lines[i];
    const prefix = isTarget ? '> ' : '  ';
    frameLines.push(`${prefix}${String(lineNum).padStart(3, ' ')} | ${lineContent}`);

    if (isTarget) {
      const colIndex = targetCol && targetCol > 0 ? targetCol : 0;
      const leadingSpaces = ' '.repeat(colIndex);
      frameLines.push(`      | ${leadingSpaces}^`);
    }
  }

  return frameLines.join('\n');
}

export function getHintForDiagram(diagramType: string, errorMessage: string): string {
  const lowerMsg = errorMessage.toLowerCase();
  const normType = diagramType.trim().toLowerCase();

  switch (normType) {
    case 'usecase-beta':
    case 'usecase':
    case 'use-case':
      return 'Start with `usecase-beta`. Declare actors with `actor ID("Label")` and system boundaries with `systemBoundary "Name" ... end` (never `{ ... }`). Use `-->` for associations, `..> :include TargetUC` for includes, and `..> :extend BaseUC` for extends.';

    case 'swimlane-beta':
    case 'swimlane':
    case 'swimlanes':
      return 'Start with `swimlane-beta LR` or `swimlane-beta TB`. Define each lane as a top-level `subgraph LaneName ... end` and connect steps across lanes with `-->` or `-->|label|`.';

    case 'graph':
    case 'flowchart':
    case 'flowchart-v2':
    case 'flowchart-elk':
    case 'elk':
      return 'Check connector arrows (e.g. `-->`, `---`, `-.->`, `==>`). If you have labels on links, wrap them in pipes: `A -->|label| B` or use `A -- label --> B`. Ensure node labels containing special characters (brackets, parens, quotes) are enclosed in double quotes, e.g. `id["Node (Label)"]`.';

    case 'sequencediagram':
    case 'sequence':
      if (lowerMsg.includes('participant') || lowerMsg.includes('actor')) {
        return 'Check participant declarations: `participant Alice` or `actor Bob as "User Bob"`.';
      }
      return 'Check sequence arrows (`->>`, `-->>`, `->`, `-->`, `-x`). Ensure `opt`, `alt`, `loop`, `critical`, and `par` blocks each have matching `end` statements.';

    case 'classdiagram':
    case 'classdiagram-v2':
    case 'class':
      return 'Check class relationships (`<|--`, `*--`, `o--`, `-->`, `..|>`). Visibility markers must be `+` (public), `-` (private), `#` (protected), or `~` (package). Ensure class bodies `{ ... }` have matching braces.';

    case 'statediagram':
    case 'statediagram-v2':
    case 'state':
      return 'Check state transitions: `[*] --> FirstState`, `FirstState --> SecondState : Event`, and `SecondState --> [*]`. Ensure composite states have closing `}`.';

    case 'erdiagram':
    case 'er':
      return 'Check entity-relationship cardinality syntax: `||--o{`, `}|..|{`, `}o--||`, etc. Ensure entity attributes are formatted inside `{ type name }` with no commas.';

    case 'agentflow-beta':
    case 'agentflow':
    case 'agent-flow':
      return 'Start with `agentflow-beta TB` or `agentflow-beta LR`. Group agent work with `flow id["Agent Name"] ... end` and declare typed nodes with `id["Label"]@{ shape: task | tool | input | decision | refdoc | action }`. Use `-->` for sequence, `-.-` for reference, and `--x` for failure.';

    case 'architecture':
    case 'architecture-beta':
    case 'arch':
      return 'Start with `architecture-beta` or `architecture`. Declare groups with `group id(icon)[Label]` and services with `service id(icon)[Label] in groupId`. Connect ports using uppercase `L`, `R`, `T`, `B` directions: `api:R --> L:db`.';

    case 'c4context':
    case 'c4container':
    case 'c4component':
    case 'c4dynamic':
    case 'c4deployment':
    case 'c4':
      return 'Start with `C4Context`, `C4Container`, `C4Component`, `C4Dynamic`, or `C4Deployment` (case-sensitive). Use macros like `Person(id, "Label", "Desc")`, `System(id, "Label", "Desc")`, `Container(id, "Label", "Tech", "Desc")`, and `Rel(from, to, "Label", "Tech")`.';

    case 'packet-beta':
    case 'packet':
      return 'Start with `packet-beta` or `packet`. Declare bit fields as `0-15: "Field Name"`, single bits as `16: "Flag"`, or relative bit widths as `+8: "Byte Field"`. Ranges must be contiguous and ascending.';

    case 'block-beta':
    case 'block':
      return 'Start with `block-beta` or `block`. Use `columns N` to set grid columns, declare blocks with `id["Label"]` or column spans `id["Label"]:2`, and close nested `block:groupId ... end` blocks with `end`.';

    case 'eventmodeling':
    case 'eventmodel':
      return 'Start with `eventmodeling`. Define timeline steps using unique numbered time frames: `tf 01 ui ScreenName`, `tf 02 cmd CommandName`, `tf 03 evt EventName`, `tf 04 rmo ReadModelName`, or `rf 05 evt ResetEvent`.';

    case 'wardley-beta':
    case 'wardley':
      return 'Start with `wardley-beta`. Coordinates use `[visibility, evolution]` between `0.0` and `1.0`: `anchor User [0.95, 0.60]`, `component API [0.70, 0.65]`. Connect with `User -> API` and evolve with `evolve API 0.85`.';

    case 'gantt':
      return 'Start with `gantt` and `dateFormat YYYY-MM-DD`. Define tasks under `section Name` as `Task Title : id, 2026-01-01, 7d` or `Task 2 : after id, 5d`.';

    case 'timeline':
      return 'Start with `timeline`. Define time periods and events separated by `:`, e.g. `2026 Q1 : Event A : Event B`.';

    case 'kanban':
      return 'Start with `kanban`. Declare columns at the top indentation level and indent task cards underneath as `taskId[Task Label]` or `taskId[Task Label]@{ assigned: "Alice", priority: "High" }`.';

    case 'gitgraph':
    case 'git':
      return 'Start with `gitGraph` (case-sensitive `G`). Statements must be: `commit`, `branch <name>`, `checkout <name>`, `merge <name>`, or `cherry-pick id: "..."`.';

    case 'journey':
    case 'userjourney':
      return 'Start with `journey`. Under `section SectionName`, format tasks as `Task Name: <score 1-5>: Actor1, Actor2` (e.g. `Browse Products: 5: Customer`).';

    case 'pie':
      return 'Start with `pie` (or `pie showData`). Each slice must have a double-quoted label followed by `:` and a positive numeric value: `"Category A" : 45`.';

    case 'quadrantchart':
    case 'quadrant':
      return 'Start with `quadrantChart` (case-sensitive `C`). Define `x-axis Left --> Right`, `y-axis Bottom --> Top`, and plot points with normalized coordinates `[0.0..1.0, 0.0..1.0]`: `Point A: [0.3, 0.8]`.';

    case 'xychart-beta':
    case 'xychart':
      return 'Start with `xychart-beta` or `xychart`. Define `x-axis [cat1, cat2, "cat 3"]`, `y-axis "Label" 0 --> 100`, and data series with `bar [10, 20, 30]` or `line [10, 20, 30]`. Multi-word labels must be double-quoted.';

    case 'sankey-beta':
    case 'sankey':
      return 'Start with `sankey-beta` or `sankey`. Follow with 3-column CSV lines `Source,Target,Value` where `Value` is a number (e.g. `Solar,Grid,50`). Do not include an unquoted text header row; use `%% source,target,value` if a comment is desired.';

    case 'mindmap':
      return 'Mindmaps are indentation-based. Ensure child nodes are consistently indented using spaces, starting from a single root node: `mindmap\\n  root((Root))\\n    Child1`.';

    case 'radar-beta':
    case 'radar':
      return 'Start with `radar-beta`. Declare axes with `axis A["Label A"], B["Label B"], C["Label C"]` and curves with curly braces: `curve c1["Series 1"]{80, 90, 70}`.';

    case 'venn-beta':
    case 'venn':
      return 'Start with `venn-beta`. Declare sets first with `set A["Set A"]` and `set B["Set B"]`, then overlaps with `union A,B["Overlap"]`. Set IDs referenced in `union` must be declared by earlier `set` lines.';

    case 'treemap':
    case 'treemap-beta':
      return 'Start with `treemap-beta`. Indentation defines hierarchy; wrap section names in double quotes (`"Section"`) and leaf nodes in double quotes with `: value` (`"Leaf Item": 25`).';

    case 'ishikawa-beta':
    case 'ishikawa':
    case 'fishbone':
      return 'Start with `ishikawa-beta`. The first indented line is the root problem/effect; subsequent indented levels define cause categories and sub-causes using spaces (no colons required).';

    case 'cynefin-beta':
    case 'cynefin':
      return 'Start with `cynefin-beta`. Use only the 5 domain keywords (`clear`, `complicated`, `complex`, `chaotic`, `confusion`), indent double-quoted items under each domain, and write transitions as `complex --> complicated : "Label"`.';

    case 'railroad-beta':
    case 'railroad':
      return 'Start with `railroad-beta`. Define grammar rules using IR constructors terminated by a semicolon: `expr = sequence(terminal("SELECT"), nonterminal("cols")) ;`.';

    case 'railroad-ebnf-beta':
    case 'ebnf':
      return 'Start with `railroad-ebnf-beta`. Define EBNF rules with `=` or `::=` and terminate each rule with `;`, e.g. `expr = term ( "+" term )* ;`. Quote terminal literals with `"..."`.';

    case 'railroad-abnf-beta':
    case 'abnf':
      return 'Start with `railroad-abnf-beta`. Define ABNF rules with `=`, `/` for alternatives, and `;` to terminate rules, e.g. `req = ("GET" / "POST") SP path ;`.';

    case 'railroad-peg-beta':
    case 'peg':
      return 'Start with `railroad-peg-beta`. Define PEG rules using `<-`, `/` for ordered choice, and `;` at the end of each rule, e.g. `Expr <- Term (("+" / "-") Term)* ;`.';

    case 'requirementdiagram':
    case 'requirement':
      return 'Start with `requirementDiagram` (case-sensitive `D`). Declare `requirement name { id: 1\\n text: "..."\\n risk: low|medium|high\\n verifymethod: test|inspection|analysis|demonstration }`, `element name { type: "..." }`, and connect with `- satisfies ->` or `- verifies ->`.';

    case 'treeview-beta':
    case 'treeview':
      return 'Start with `treeView-beta` (case-sensitive capital `V`). Define the file/folder hierarchy using indentation or box-drawing characters (`├──`, `└──`), quoting names that contain spaces.';

    default:
      if (lowerMsg.includes('unrecognized text') || lowerMsg.includes('lexical error')) {
        return 'Check for stray unescaped characters, unsupported markdown formatting, or typos in diagram keywords. Call `get_diagram_syntax_guide` for verified syntax examples.';
      }
      return 'Verify that the Mermaid header syntax is valid and all opening delimiters, quotes, and brackets are properly closed. Call `get_diagram_syntax_guide` for exact grammar rules.';
  }
}

export function buildDiagnosticReport(syntax: string, rawError: any): DiagnosticReport {
  const errorMessage =
    typeof rawError === 'string'
      ? rawError
      : rawError?.message || rawError?.str || String(rawError);

  const diagramType = detectDiagramType(syntax);
  const { line, column } = extractLineAndColumn(errorMessage, rawError);
  const codeFrame = createCodeFrame(syntax, line, column);
  const hint = getHintForDiagram(diagramType, errorMessage);

  const formattedMarkdown = [
    '❌ **Mermaid Render Failed: Syntax Error**',
    '',
    `- **Diagram Type**: \`${diagramType}\``,
    line ? `- **Location**: Line ${line}${column ? `, Column ${column}` : ''}` : null,
    '',
    '**Code Context**:',
    '```',
    codeFrame,
    '```',
    '',
    '**Error Details**:',
    errorMessage,
    '',
    '💡 **Remediation Hint**:',
    hint,
  ]
    .filter((part): part is string => part !== null)
    .join('\n');

  return {
    diagramType,
    line,
    column,
    rawError: errorMessage,
    details: errorMessage,
    codeFrame,
    hint,
    formattedMarkdown,
  };
}
