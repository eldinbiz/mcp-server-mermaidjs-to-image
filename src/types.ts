import { z } from 'zod';

export const ThemeEnum = z.enum([
  'default',
  'neutral',
  'dark',
  'forest',
  'base',
  'neo',
  'neo-dark',
  'redux',
  'redux-dark',
  'redux-color',
  'redux-dark-color',
]);
export type Theme = z.infer<typeof ThemeEnum>;

export const LookEnum = z.enum(['classic', 'neo', 'handDrawn']);
export type Look = z.infer<typeof LookEnum>;

export const DARK_THEMES: ReadonlySet<Theme> = new Set<Theme>([
  'dark',
  'neo-dark',
  'redux-dark',
  'redux-dark-color',
]);

export const DEFAULT_DARK_BACKGROUND = '#1e1e2e';
export const DEFAULT_LIGHT_BACKGROUND = 'white';
export const DEFAULT_CANVAS_PADDING = 24;
export const MAX_CANVAS_PADDING = 128;

/**
 * Resolves the effective background color based on the requested theme and explicit background option.
 * Dark themes ("dark", "neo-dark", "redux-dark", "redux-dark-color") default to "#1e1e2e" when no
 * background is explicitly provided; all other themes default to "white".
 */
export function resolveEffectiveBackground(theme?: Theme, background?: string): string {
  if (background && background.trim().length > 0) {
    return background.trim();
  }
  if (theme && DARK_THEMES.has(theme)) {
    return DEFAULT_DARK_BACKGROUND;
  }
  return DEFAULT_LIGHT_BACKGROUND;
}

/**
 * Resolves and clamps the outer canvas padding around rendered diagrams (default: 24px, range: 0..128px).
 */
export function resolveEffectivePadding(padding?: number): number {
  if (typeof padding !== 'number' || !Number.isFinite(padding)) {
    return DEFAULT_CANVAS_PADDING;
  }
  return Math.max(0, Math.min(MAX_CANVAS_PADDING, Math.round(padding)));
}

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
    .describe('Visual theme: default, neutral, dark, forest, base, neo, neo-dark, redux, redux-dark, redux-color, or redux-dark-color'),
  look: LookEnum.optional()
    .describe('Visual rendering look style: "classic" (standard clean lines), "neo" (modern flat style with rounded corners and subtle shadows), or "handDrawn" (sketch-like rough hand-drawn aesthetic)'),

  background: z
    .string()
    .optional()
    .describe('Background color: "white", "transparent", or any CSS color code (e.g. "#1e1e2e"). Defaults to "white" for light themes and "#1e1e2e" for dark themes ("dark", "neo-dark", "redux-dark", "redux-dark-color").'),
  padding: z
    .number()
    .int()
    .min(0)
    .max(MAX_CANVAS_PADDING)
    .optional()
    .default(DEFAULT_CANVAS_PADDING)
    .describe(
      'Outer canvas margin around the diagram in CSS pixels (integer 0–128, default: 24). Controls the whitespace border filled with the effective background color. Use 0–8 for tight crops inside slides, UI cards, or compact Markdown tables; keep 24 (default) or 32–48 for comfortable breathing room and to avoid clipping drop shadows (`look: "neo"`) or wide arrowhead markers.'
    ),
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
    .describe('Visual theme: default, neutral, dark, forest, base, neo, neo-dark, redux, redux-dark, redux-color, or redux-dark-color'),
  look: LookEnum.optional()
    .describe('Visual rendering look style: "classic" (standard clean lines), "neo" (modern flat style with rounded corners and subtle shadows), or "handDrawn" (sketch-like rough hand-drawn aesthetic)'),

  background: z
    .string()
    .optional()
    .describe('Background color: "white", "transparent", or any CSS color code (e.g. "#1e1e2e"). Defaults to "white" for light themes and "#1e1e2e" for dark themes ("dark", "neo-dark", "redux-dark", "redux-dark-color").'),
  padding: z
    .number()
    .int()
    .min(0)
    .max(MAX_CANVAS_PADDING)
    .optional()
    .default(DEFAULT_CANVAS_PADDING)
    .describe(
      'Outer canvas margin around the diagram in CSS pixels (integer 0–128, default: 24). Controls the whitespace border filled with the effective background color. Use 0–8 for tight crops inside slides, UI cards, or compact Markdown tables; keep 24 (default) or 32–48 for comfortable breathing room and to avoid clipping drop shadows (`look: "neo"`) or wide arrowhead markers.'
    ),
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
  padding?: number;
  renderTimeMs?: number;
  cacheHit?: boolean;
  diagnostics?: DiagnosticReport;
}
