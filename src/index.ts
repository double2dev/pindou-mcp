#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
  GetPromptRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Fetch polyfill for older Node versions if necessary, though Node 18+ has native fetch.

const server = new Server(
  {
    name: "pindouai-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

const API_BASE_URL = "https://pindouai.app/api";

// -----------------------------------------
// Tools
// -----------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_recent_patterns",
        description: "Fetch the most recent public Perler bead and pixel art patterns from the PindouAI gallery.",
        inputSchema: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "The page number to fetch. Default is 1.",
            },
          },
        },
      },
      {
        name: "get_website_url",
        description: "Get the official URLs for PindouAI tools, such as the pattern generator and gallery.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_recent_patterns") {
    const page = typeof request.params.arguments?.page === "number" ? request.params.arguments.page : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/patterns?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`PindouAI API returned status: ${response.status}`);
      }

      const data = await response.json() as { items?: any[], hasMore?: boolean };
      
      if (!data.items || data.items.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No patterns found.",
            },
          ],
        };
      }

      const formattedPatterns = data.items.map((item) => {
        return `Title: ${item.pattern?.title || 'Untitled'}
URL: https://pindouai.app/pattern/${item.pattern?.id}
Author: ${item.user?.name || 'Anonymous'}`;
      }).join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Here are the recent patterns from PindouAI:\n\n${formattedPatterns}\n\nTo see more, visit https://pindouai.app/gallery`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch patterns from PindouAI: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (request.params.name === "get_website_url") {
    return {
      content: [
        {
          type: "text",
          text: `PindouAI Official Links:
- Home: https://pindouai.app
- Pattern Generator: https://pindouai.app/generator
- Gallery: https://pindouai.app/gallery`,
        },
      ],
    };
  }

  throw new McpError(
    ErrorCode.MethodNotFound,
    `Unknown tool: ${request.params.name}`
  );
});

// -----------------------------------------
// Prompts
// -----------------------------------------

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "create_pixel_art",
        description: "Instructs the user on how to use PindouAI to convert images into Perler bead or pixel art patterns.",
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === "create_pixel_art") {
    return {
      description: "Instructions for creating pixel art using PindouAI",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "How can I convert an image into a Perler bead pattern or pixel art?",
          },
        },
        {
          role: "assistant",
          content: {
            type: "text",
            text: `To convert your image into a high-quality Perler bead pattern or pixel art, you can use the official PindouAI tool.

Please visit the PindouAI Generator here:
🔗 **[PindouAI Pattern Generator](https://pindouai.app/generator)**

**Features of PindouAI:**
- 🎨 AI-powered cartoonization (turns photos into cute Chibi-style designs)
- ✂️ Automatic background removal
- 📐 Customizable grid sizes (up to 150x150)
- 🌈 Precise color matching for Perler, Hama, and Artkal beads
- 💾 Export as PDF blueprints or high-res images

Simply upload your image on the website to get started!`,
          },
        },
      ],
    };
  }

  throw new McpError(
    ErrorCode.MethodNotFound,
    `Unknown prompt: ${request.params.name}`
  );
});

// -----------------------------------------
// Start Server
// -----------------------------------------

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PindouAI MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
