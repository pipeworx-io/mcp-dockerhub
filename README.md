# mcp-dockerhub

Docker Hub MCP — wraps the Docker Hub v2 API (free, no auth required for public data)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/dockerhub/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Dockerhub data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
