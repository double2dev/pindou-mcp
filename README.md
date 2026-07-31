# PindouAI MCP Server

[![smithery badge](https://smithery.ai/badge/pindouai-mcp-server)](https://smithery.ai/server/pindouai-mcp-server)

An official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **[PindouAI](https://pindouai.app)**.

PindouAI is an advanced web application for converting images into high-quality Perler bead patterns, Hama bead templates, and pixel art blueprints. This MCP server allows AI assistants (like Claude, Cursor, and others) to interact directly with the PindouAI ecosystem.

## Features

### 🛠 Tools

- **`get_recent_patterns`**: Fetches the most recent public creations from the [PindouAI Gallery](https://pindouai.app/gallery). Allows the LLM to showcase real examples of pixel art patterns created by the community.
- **`get_website_url`**: Returns the official URLs for PindouAI services (Home, Generator, Gallery).

### 💬 Prompts

- **`create_pixel_art`**: A pre-defined prompt that LLMs can use to instruct users on how to convert their images into Perler bead or pixel art patterns using the [PindouAI Generator](https://pindouai.app/generator).

## Usage with Desktop Apps

### Claude Desktop

To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pindouai": {
      "command": "npx",
      "args": [
        "-y",
        "pindouai-mcp-server"
      ]
    }
  }
}
```

### Cursor

To use this with Cursor, go to `Cursor Settings > Features > MCP` and add a new server:

- **Name**: `pindouai`
- **Type**: `command`
- **Command**: `npx -y pindouai-mcp-server`

## Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```
4. Run locally for testing:
   ```bash
   npm start
   ```

## About PindouAI

[PindouAI (拼豆AI)](https://pindouai.app) provides tools for crafting enthusiasts and pixel artists:
- **AI Cartoonization**: Convert photos into cute Chibi-style designs.
- **Auto Background Removal**: Clean up images before pixelation.
- **Precise Color Matching**: Automatically matches your image to real-world Perler, Hama, and Artkal bead palettes.
- **PDF Blueprints**: Export your designs to highly detailed PDF blueprints for printing and crafting.

Visit [pindouai.app](https://pindouai.app) to start creating!

## License

This project is licensed under the MIT License.
