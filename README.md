# mcp-dockerhub

Docker Hub MCP — wraps the Docker Hub v2 API (free, no auth required for public data)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_images` | Search Docker Hub for container images by keyword. Returns repository name, description, pull count, star count, and official status. Use when finding images for deployment. |
| `get_image` | Get detailed metadata for a Docker Hub repository: description, pull count, stars, last updated date, and official status. Use before pulling an image to verify quality and currency. |
| `get_tags` | List available tags for a Docker image sorted by recency. Returns tag name, digest, size, and push date. Use to find and select specific versions to pull. |
| `get_tag_details` | Get full details for a SPECIFIC image tag, including every platform/architecture it supports (os/arch/variant), per-platform digests and sizes, the multi-arch manifest digest, and push date. PREFER for "does <image>:<tag> have an arm64 build", "what platforms does <image>:<tag> support", "the digest/size of <image>:<tag>", multi-arch verification. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "dockerhub": {
      "url": "https://gateway.pipeworx.io/dockerhub/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Dockerhub data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
