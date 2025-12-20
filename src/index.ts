#!/usr/bin/env node

/**
 * Upmind API Documentation MCP Server
 * Provides tools to search and retrieve Upmind API documentation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DocumentationCache } from './cache/documentation-cache.js';
import { searchEndpoints } from './tools/search-endpoints.js';
import { getEndpointDetails } from './tools/get-endpoint-details.js';
import { listApiGroups } from './tools/list-groups.js';
import { getGroupEndpoints } from './tools/get-group-endpoints.js';

const docCache = new DocumentationCache();

const server = new Server(
  {
    name: 'upmind-api-docs',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_endpoints',
        description:
          'Search Upmind API endpoints by keyword. Searches across endpoint names, descriptions, groups, and titles. Returns matching endpoints with relevance scoring.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (searches in name, title, description, and group)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_endpoint_details',
        description:
          'Get detailed information about a specific Upmind API endpoint, including parameters, response schema, headers, and permissions. You can search by endpoint name or URL pattern.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: "Endpoint name (e.g., 'GetClientAccounts') or URL pattern (e.g., '/clients/{id}/accounts')",
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'list_api_groups',
        description:
          'List all API endpoint groups/categories in the Upmind API documentation. Each group represents a functional area of the API.',
        inputSchema: {
          type: 'object',
          properties: {
            includeCount: {
              type: 'boolean',
              description: 'Include endpoint count per group (default: true)',
              default: true,
            },
          },
        },
      },
      {
        name: 'get_group_endpoints',
        description:
          'Get all API endpoints within a specific group/category. Useful for exploring all operations available in a functional area.',
        inputSchema: {
          type: 'object',
          properties: {
            group: {
              type: 'string',
              description: "Group name (e.g., 'Accounts', '2FA_Client')",
            },
            includeDetails: {
              type: 'boolean',
              description: 'Include full endpoint details instead of just summaries (default: false)',
              default: false,
            },
          },
          required: ['group'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    const docs = await docCache.getDocumentation();

    let result: unknown;

    switch (name) {
      case 'search_endpoints':
        result = searchEndpoints(docs, {
          query: (args as any).query as string,
          limit: (args as any).limit as number | undefined,
        });
        break;

      case 'get_endpoint_details':
        result = getEndpointDetails(docs, {
          name: (args as any).name as string,
        });
        break;

      case 'list_api_groups':
        result = listApiGroups(docs, {
          includeCount: (args as any).includeCount as boolean | undefined,
        });
        break;

      case 'get_group_endpoints':
        result = getGroupEndpoints(docs, {
          group: (args as any).group as string,
          includeDetails: (args as any).includeDetails as boolean | undefined,
        });
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Upmind API Documentation MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
