import fs from 'node:fs';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MermaidRenderer } from './renderer.js';
import {
  RenderMermaidToPngSchema,
  RenderMermaidFileSchema,
  GetSupportedDiagramsSchema,
  GetDiagramSyntaxGuideSchema,
} from './types.js';
import {
  MERMAID_VERSION,
  getSupportedDiagramsSummary,
  getDiagramSyntaxGuide,
  validateAndNormalizeDiagramType,
} from './catalog.js';

const renderer = new MermaidRenderer(5); // 5 minutes idle timeout

const server = new McpServer(
  {
    name: 'mcp-mermaidjs-to-image',
    version: '0.2.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool 1: get_supported_diagrams
server.tool(
  'get_supported_diagrams',
  'Returns the Mermaid.js engine version (v12.3.0) and the full catalog of all 37+ supported diagram types, keywords, aliases, and categories. Pointers guide the AI to query get_diagram_syntax_guide for deep syntax rules.',
  GetSupportedDiagramsSchema.shape,
  async (args) => {
    const summary = getSupportedDiagramsSummary(args.category, args.query);
    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }
);

// Tool 2: get_diagram_syntax_guide
server.tool(
  'get_diagram_syntax_guide',
  'Returns authoritative syntax rules, keyword requirements, relationship connectors, common pitfalls, and verified working examples for a specific diagram type (e.g. "usecase-beta", "swimlane-beta", "sequenceDiagram", "architecture", "flowchart").',
  GetDiagramSyntaxGuideSchema.shape,
  async (args) => {
    const result = getDiagramSyntaxGuide(args.diagram_type);
    return {
      isError: !result.success,
      content: [
        {
          type: 'text',
          text: result.content,
        },
      ],
    };
  }
);

// Tool 3: render_mermaid_to_png
server.tool(
  'render_mermaid_to_png',
  'Renders Mermaid.js diagram syntax into a high-resolution PNG image. Requires an explicit diagram_type keyword (e.g. "usecase-beta", "swimlane-beta", "sequenceDiagram", "flowchart"). Rejects requests if diagram_type is missing or invalid, returning valid keyword feedback.',
  RenderMermaidToPngSchema.shape,
  async (args) => {
    // 1. Mandatory keyword validation
    const validation = validateAndNormalizeDiagramType(args.diagram_type);
    if (!validation.valid || !validation.canonicalKeyword) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text:
              validation.feedbackMessage ||
              '❌ Invalid or missing `diagram_type` parameter. Call `get_supported_diagrams` to inspect all valid diagram keywords.',
          },
        ],
      };
    }

    // 2. Render diagram with normalized diagramType
    const result = await renderer.renderToPng({
      mermaidSyntax: args.mermaid_syntax,
      diagramType: validation.canonicalKeyword,
      outputPath: args.output_path,
      theme: args.theme,
      look: args.look,
      background: args.background,
      scale: args.scale,
      width: args.width,
      height: args.height,
    });

    if (!result.success || !result.base64Png) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text:
              result.diagnostics?.formattedMarkdown ||
              '❌ Unknown error occurred while rendering the Mermaid diagram.',
          },
        ],
      };
    }

    const messageLines = [
      '✅ Successfully rendered Mermaid diagram to PNG.',
      `- **Engine**: Mermaid.js v${MERMAID_VERSION}`,
      `- **Diagram Type**: \`${validation.canonicalKeyword}\``,
      `- **Dimensions**: ${result.width} × ${result.height} px`,
      `- **DPI Scale**: ${args.scale ?? 2}x`,
      ...(args.theme ? [`- **Theme**: \`${args.theme}\``] : []),
      ...(args.look ? [`- **Look**: \`${args.look}\``] : []),
      `- **Background**: \`${args.background ?? 'white'}\``,
    ];

    if (result.outputPath) {
      messageLines.push(`- **Saved to**: \`${result.outputPath}\``);
    }

    return {
      content: [
        {
          type: 'image',
          data: result.base64Png,
          mimeType: 'image/png',
        },
        {
          type: 'text',
          text: messageLines.join('\n'),
        },
      ],
    };
  }
);

// Tool 4: render_mermaid_file
server.tool(
  'render_mermaid_file',
  'Reads a local .mmd or .mermaid file, validates the mandatory diagram_type, renders it into a high-resolution PNG image, and writes the output file to disk.',
  RenderMermaidFileSchema.shape,
  async (args) => {
    // 1. Mandatory keyword validation
    const validation = validateAndNormalizeDiagramType(args.diagram_type);
    if (!validation.valid || !validation.canonicalKeyword) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text:
              validation.feedbackMessage ||
              '❌ Invalid or missing `diagram_type` parameter. Call `get_supported_diagrams` to inspect all valid diagram keywords.',
          },
        ],
      };
    }

    const resolvedInput = path.resolve(args.input_path);
    if (!fs.existsSync(resolvedInput)) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `❌ Input file not found: \`${resolvedInput}\`. Please verify the path.`,
          },
        ],
      };
    }

    let syntax: string;
    try {
      syntax = await fs.promises.readFile(resolvedInput, 'utf8');
    } catch (readErr: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `❌ Failed to read input file \`${resolvedInput}\`: ${readErr?.message || readErr}`,
          },
        ],
      };
    }

    const result = await renderer.renderToPng({
      mermaidSyntax: syntax,
      diagramType: validation.canonicalKeyword,
      outputPath: args.output_path,
      theme: args.theme,
      look: args.look,
      background: args.background,
      scale: args.scale,
      width: args.width,
      height: args.height,
    });

    if (!result.success || !result.base64Png) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text:
              result.diagnostics?.formattedMarkdown ||
              `❌ Failed to render diagram from \`${resolvedInput}\`.`,
          },
        ],
      };
    }

    const messageLines = [
      `✅ Successfully rendered diagram from \`${resolvedInput}\` to PNG.`,
      `- **Engine**: Mermaid.js v${MERMAID_VERSION}`,
      `- **Diagram Type**: \`${validation.canonicalKeyword}\``,
      `- **Saved to**: \`${result.outputPath}\``,
      `- **Dimensions**: ${result.width} × ${result.height} px`,
      `- **DPI Scale**: ${args.scale ?? 2}x`,
      ...(args.theme ? [`- **Theme**: \`${args.theme}\``] : []),
      ...(args.look ? [`- **Look**: \`${args.look}\``] : []),
    ];

    return {
      content: [
        {
          type: 'image',
          data: result.base64Png,
          mimeType: 'image/png',
        },
        {
          type: 'text',
          text: messageLines.join('\n'),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const cleanup = async () => {
    await renderer.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main().catch(async (error) => {
  console.error('Fatal MCP Server Error:', error);
  await renderer.close();
  process.exit(1);
});
