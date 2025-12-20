# Upmind API Documentation MCP Server

A Model Context Protocol (MCP) server that provides search and retrieval tools for Upmind API documentation.

## Features

- **Search Endpoints**: Search across 14+ API endpoints by keyword with relevance scoring
- **Get Endpoint Details**: Retrieve complete endpoint information including parameters, responses, and headers
- **List API Groups**: View all 6 API categories (2FA_Client, 2FA_User, Accounts, AdminInvoiceProducts_Group, AdminPayments, Admin_Invoices)
- **Get Group Endpoints**: Fetch all endpoints within a specific category

## Installation

```bash
npm install
npm run build
```

## Usage

### Configuration for Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "upmind-api-docs": {
      "command": "node",
      "args": ["/Users/vahid/upmind/upmind-mcp/dist/index.js"]
    }
  }
}
```

### Available Tools

#### 1. search_endpoints
Search for API endpoints by keyword.

**Parameters:**
- `query` (string, required): Search query
- `limit` (number, optional): Maximum results (default: 10)

**Example:**
```json
{
  "query": "client accounts",
  "limit": 5
}
```

#### 2. get_endpoint_details
Get detailed information about a specific endpoint.

**Parameters:**
- `name` (string, required): Endpoint name or URL pattern

**Example:**
```json
{
  "name": "GetClientAccounts"
}
```

#### 3. list_api_groups
List all API groups/categories.

**Parameters:**
- `includeCount` (boolean, optional): Include endpoint counts (default: true)

**Example:**
```json
{
  "includeCount": true
}
```

#### 4. get_group_endpoints
Get all endpoints in a specific group.

**Parameters:**
- `group` (string, required): Group name
- `includeDetails` (boolean, optional): Include full details (default: false)

**Example:**
```json
{
  "group": "Accounts",
  "includeDetails": false
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Type check
npm run typecheck

# Run server
npm start
```

## Important: Upmind API Pagination

**When calling the actual Upmind API endpoints** (e.g., in Postman or your application), be aware that:

- **Default Result Limit**: Upmind API returns only **10 results by default**
- **Pagination Parameters**: Use `limit` and `offset` query parameters to retrieve more results

### Example API Calls

Get first 10 invoices (default):
```
GET https://api.upmind.io/api/invoices
```

Get 50 invoices:
```
GET https://api.upmind.io/api/invoices?limit=50
```

Get next page (skip first 50, get next 50):
```
GET https://api.upmind.io/api/invoices?limit=50&offset=50
```

This pagination behavior applies to most Upmind API list endpoints including invoices, clients, contracts, etc.

## Data Source

Documentation is fetched from:
- https://apidocs.upmind.com/api_data.json
- https://apidocs.upmind.com/api_project.json

Data is cached in-memory with a 1-hour TTL for optimal performance.

## Architecture

```
src/
├── index.ts                    # Main MCP server
├── types/apidoc.ts            # Type definitions
├── cache/documentation-cache.ts # Data fetching and caching
├── tools/                      # Tool implementations
│   ├── search-endpoints.ts
│   ├── get-endpoint-details.ts
│   ├── list-groups.ts
│   └── get-group-endpoints.ts
└── utils/                      # Helper utilities
    ├── formatters.ts
    └── matchers.ts
```

## License

MIT
