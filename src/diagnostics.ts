import { DiagnosticReport } from './types.js';

export function detectDiagramType(syntax: string): string {
  const lines = syntax.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
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

  switch (diagramType) {
    case 'graph':
    case 'flowchart':
      return 'Check connector arrows (e.g. `-->`, `---`, `-.->`, `==>`). If you have labels on links, wrap them in pipes: `A -->|label| B` or use `A -- label --> B`. Ensure node labels containing special characters (brackets, parens, quotes) are enclosed in double quotes, e.g. `id["Node (Label)"]`.';

    case 'sequencediagram':
      if (lowerMsg.includes('participant') || lowerMsg.includes('actor')) {
        return 'Check participant declarations: `participant Alice` or `actor Bob as "User Bob"`.';
      }
      return 'Check sequence arrows (`->>`, `-->>`, `->`, `-->`). Ensure `opt`, `alt`, `loop`, `critical`, and `par` blocks each have matching `end` statements.';

    case 'classdiagram':
      return 'Check class relationships (`<|--`, `*--`, `o--`, `-->`). Visibility markers must be `+` (public), `-` (private), `#` (protected), or `~` (package).';

    case 'statediagram':
    case 'statediagram-v2':
      return 'Check state transitions: `[*] --> FirstState`, `FirstState --> SecondState : Event`, and `SecondState --> [*]`. Ensure composite states have closing `}`.';

    case 'erdiagram':
      return 'Check entity-relationship cardinality syntax: `||--o{`, `}|..|{`, etc. Ensure entity attributes are formatted inside `{ type name }`.';

    case 'gitgraph':
      return 'GitGraph statements must be: `commit`, `branch <name>`, `checkout <name>`, `merge <name>`, or `cherry-pick id: "..."`.';

    case 'mindmap':
      return 'Mindmaps are indentation-based. Ensure child nodes are consistently indented using spaces, starting from a single root node: `mindmap\\n  root((Root))\\n    Child1`.';

    default:
      if (lowerMsg.includes('unrecognized text') || lowerMsg.includes('lexical error')) {
        return 'Check for stray unescaped characters, unsupported markdown formatting, or typos in diagram keywords.';
      }
      return 'Verify that the Mermaid header syntax is valid and all opening delimiters, quotes, and brackets are properly closed.';
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
