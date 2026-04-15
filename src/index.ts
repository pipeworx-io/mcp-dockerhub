interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Docker Hub MCP — wraps the Docker Hub v2 API (free, no auth required for public data)
 *
 * Tools:
 * - search_images: search Docker Hub for public repositories
 * - get_image: fetch metadata for a specific image (namespace/name)
 * - get_tags: list available tags for an image
 */


const BASE = 'https://hub.docker.com/v2';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_images',
    description:
      'Search Docker Hub for public images. Returns repository name, description, pull count, star count, and whether it is official or automated.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "nginx", "postgres")',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (default 10, max 100)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_image',
    description:
      'Get metadata for a Docker Hub repository: pull count, star count, description, last updated, and full description.',
    inputSchema: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          description: 'Repository namespace — use "library" for official images (e.g., "library", "bitnami")',
        },
        name: {
          type: 'string',
          description: 'Repository name (e.g., "nginx", "redis")',
        },
      },
      required: ['namespace', 'name'],
    },
  },
  {
    name: 'get_tags',
    description:
      'List available tags for a Docker Hub image, ordered by last pushed date. Returns tag name, digest, size, and last pushed timestamp.',
    inputSchema: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          description: 'Repository namespace (use "library" for official images)',
        },
        name: {
          type: 'string',
          description: 'Repository name',
        },
        limit: {
          type: 'number',
          description: 'Number of tags to return (default 20, max 100)',
        },
      },
      required: ['namespace', 'name'],
    },
  },
];

async function hubGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Image not found: ${path}`);
    throw new Error(`Docker Hub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function searchImages(query: string, limit: number) {
  const pageSize = Math.min(100, Math.max(1, limit));
  const params = new URLSearchParams({
    query,
    page_size: String(pageSize),
  });
  const data = (await hubGet(`/search/repositories/?${params}`)) as {
    results: {
      repo_name: string;
      short_description: string | null;
      star_count: number;
      pull_count: number;
      is_official: boolean;
      is_automated: boolean;
    }[];
    count: number;
  };

  return {
    total: data.count,
    images: data.results.map((r) => ({
      name: r.repo_name,
      description: r.short_description ?? null,
      stars: r.star_count,
      pulls: r.pull_count,
      is_official: r.is_official,
      is_automated: r.is_automated,
    })),
  };
}

async function getImage(namespace: string, name: string) {
  const data = (await hubGet(
    `/repositories/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/`,
  )) as {
    name: string;
    namespace: string;
    description: string | null;
    full_description: string | null;
    pull_count: number;
    star_count: number;
    last_updated: string | null;
    is_private: boolean;
    hub_user: string;
  };

  return {
    full_name: `${data.namespace}/${data.name}`,
    description: data.description ?? null,
    full_description: data.full_description ?? null,
    pulls: data.pull_count,
    stars: data.star_count,
    last_updated: data.last_updated ?? null,
    is_private: data.is_private,
    hub_user: data.hub_user,
  };
}

async function getTags(namespace: string, name: string, limit: number) {
  const pageSize = Math.min(100, Math.max(1, limit));
  const params = new URLSearchParams({ page_size: String(pageSize) });
  const data = (await hubGet(
    `/repositories/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/tags/?${params}`,
  )) as {
    results: {
      name: string;
      digest: string | null;
      full_size: number;
      last_pushed: string | null;
      last_updated: string | null;
      tag_status: string;
    }[];
    count: number;
  };

  return {
    total: data.count,
    tags: data.results.map((t) => ({
      tag: t.name,
      digest: t.digest ?? null,
      size_bytes: t.full_size,
      last_pushed: t.last_pushed ?? t.last_updated ?? null,
      status: t.tag_status,
    })),
  };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_images':
      return searchImages(args.query as string, (args.limit as number) ?? 10);
    case 'get_image':
      return getImage(args.namespace as string, args.name as string);
    case 'get_tags':
      return getTags(args.namespace as string, args.name as string, (args.limit as number) ?? 20);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
