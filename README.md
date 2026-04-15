# mcp-dockerhub

Docker Hub MCP — wraps the Docker Hub v2 API (free, no auth required for public data)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "dockerhub": {
      "url": "https://gateway.pipeworx.io/dockerhub/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use dockerhub
```

## License

MIT
