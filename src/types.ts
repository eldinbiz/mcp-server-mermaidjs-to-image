import { z } from 'zod';

export const ThemeEnum = z.enum(['default', 'neutral', 'dark', 'forest', 'base']);
export type Theme = z.infer<typeof ThemeEnum>;

export const GetSupportedDiagramsSchema = z.object({
  category: z
    .string()
    .optional()
    .describe('Optional category filter: "uml", "architecture", "planning", "charts", or "grammar"'),
  query: z
    .string()
    .optional()
    .describe('Optional search query to match against diagram names, keywords, aliases, or descriptions'),
});

export type GetSupportedDiagramsInput = z.infer<typeof GetSupportedDiagramsSchema>;

export const GetDiagramSyntaxGuideSchema = z.object({
  diagram_type: z
    .string()
    .describe('The diagram type keyword or alias to retrieve detailed syntax rules and examples for (e.g. "usecase-beta", "swimlane-beta", "sequenceDiagram", "architecture", "flowchart", "packet-beta", "gantt")'),
});

export type GetDiagramSyntaxGuideInput = z.infer<typeof GetDiagramSyntaxGuideSchema>;

export const RenderMermaidToPngSchema = z.object({
  diagram_type: z
    .string()
    .describe('Required diagram type keyword supported by the Mermaid v12.3.0 engine (e.g. "usecase-beta", "swimlane-beta", "sequenceDiagram", "flowchart", "classDiagram", "architecture", "gantt"). Call "get_supported_diagrams" to view all available keywords.'),
  mermaid_syntax: z
    .string()
    .describe('The Mermaid diagram syntax string to render into PNG (e.g. "usecase-beta\\n  actor User")'),
  output_path: z
    .string()
    .optional()
    .describe('Optional absolute or relative file path to save the resulting PNG image to disk'),
  theme: ThemeEnum.optional()
    .default('default')
    .describe('Visual theme for the Mermaid diagram: default, neutral, dark, forest, or base'),
  background: z
    .string()
    .optional()
    .default('white')
    .describe('Background color: "white", "transparent", or any CSS color code (e.g. "#1e1e2e")'),
  scale: z
    .number()
    .positive()
    .optional()
    .default(2)
    .describe('Resolution scale factor (default: 2 for sharp retina quality, use 1 for standard, 3 for ultra-crisp)'),
  width: z
    .number()
    .positive()
    .optional()
    .describe('Optional viewport width hint in pixels'),
  height: z
    .number()
    .positive()
    .optional()
    .describe('Optional viewport height hint in pixels'),
});

export type RenderMermaidToPngInput = z.infer<typeof RenderMermaidToPngSchema>;

export const RenderMermaidFileSchema = z.object({
  diagram_type: z
    .string()
    .describe('Required diagram type keyword supported by the Mermaid v12.3.0 engine (e.g. "usecase-beta", "swimlane-beta", "sequenceDiagram", "flowchart", "classDiagram", "architecture", "gantt"). Call "get_supported_diagrams" to view all available keywords.'),
  input_path: z
    .string()
    .describe('Absolute or relative path to a local .mmd or .mermaid file to render'),
  output_path: z
    .string()
    .describe('Absolute or relative path where the rendered PNG image should be saved'),
  theme: ThemeEnum.optional()
    .default('default')
    .describe('Visual theme for the Mermaid diagram: default, neutral, dark, forest, or base'),
  background: z
    .string()
    .optional()
    .default('white')
    .describe('Background color: "white", "transparent", or any CSS color code (e.g. "#1e1e2e")'),
  scale: z
    .number()
    .positive()
    .optional()
    .default(2)
    .describe('Resolution scale factor (default: 2 for sharp retina quality)'),
  width: z
    .number()
    .positive()
    .optional()
    .describe('Optional viewport width hint in pixels'),
  height: z
    .number()
    .positive()
    .optional()
    .describe('Optional viewport height hint in pixels'),
});

export type RenderMermaidFileInput = z.infer<typeof RenderMermaidFileSchema>;

export interface DiagnosticReport {
  diagramType?: string;
  line?: number;
  column?: number;
  rawError: string;
  details: string;
  codeFrame?: string;
  hint?: string;
  formattedMarkdown: string;
}

export interface RenderResult {
  success: boolean;
  pngBuffer?: Buffer;
  base64Png?: string;
  outputPath?: string;
  width?: number;
  height?: number;
  diagnostics?: DiagnosticReport;
}
