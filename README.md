# MCP UI Dashboard

This is the standalone frontend for the MCP database server.
It connects to an existing MCP backend over HTTP and provides a clean developer UI for exploring schemas and running safe queries.

## What this project does

The dashboard allows you to:

- select PostgreSQL or MSSQL
- load tables from the MCP backend
- click a table to inspect its schema
- run read-only SQL queries
- view tabular results in a responsive grid

It does not connect to any database directly.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Fetch API

## Project structure

- `app/page.tsx` - main dashboard layout and state management
- `app/components/Sidebar.tsx` - database selector and table explorer
- `app/components/QueryEditor.tsx` - SQL editor and run action
- `app/components/ResultsTable.tsx` - query results table
- `app/components/SchemaViewer.tsx` - schema inspection view
- `hooks/useMCP.ts` - shared MCP request helper
- `lib/config.ts` - centralized frontend config
- `types/index.ts` - shared types

## Setup

1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env`
3. Set `NEXT_PUBLIC_MCP_URL` to the deployed MCP backend URL
4. Start the app:
   - `npm run dev`

## Environment variables

```env
NEXT_PUBLIC_MCP_URL=https://your-mcp-app.vercel.app
```

## Centralized config

All frontend API calls use `lib/config.ts`.
That file contains:

- `mcpBaseUrl`
- `defaultDB`
- `maxRows`

To change the backend URL, update only the `.env` file.

## UI behavior

### Sidebar

- choose PostgreSQL or MSSQL
- load tables from the backend
- click a table to load its schema

### Query editor

- enter or edit SQL
- run the query through MCP
- uses a read-only backend endpoint

### Schema viewer

- shows `column_name`
- shows `data_type`
- updates when a table is selected

### Results table

- renders dynamic columns from returned rows
- supports empty results
- shows API/query errors in the UI

## Supported flows

1. Load tables
2. Click a table to load schema
3. Run a query and render results
4. Switch database and reload tables/schema

## MCP request contract

The dashboard sends POST requests to:

```text
{NEXT_PUBLIC_MCP_URL}/api/mcp
```

Example payloads:

### list_tables

```json
{
  "tool": "list_tables",
  "input": {
    "db": "postgres"
  }
}
```

### get_table_schema

```json
{
  "tool": "get_table_schema",
  "input": {
    "db": "mssql",
    "table": "Users"
  }
}
```

### run_query

```json
{
  "tool": "run_query",
  "input": {
    "db": "postgres",
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

## Response handling

The UI expects this envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

If `success` is false, the dashboard shows the returned error message in a red alert box.

## Security notes

- no direct DB connection from the UI
- all requests go through MCP HTTP
- backend URL comes from environment variables only
- no hardcoded backend URL in code

## Design notes

- responsive layout
- dark developer-style interface
- bordered cards and scrollable panes
- sticky table headers for readability

## Deployment

Deploy the UI separately on Vercel.

### Required environment variable

- `NEXT_PUBLIC_MCP_URL`

### Recommended deployment order

1. Deploy the backend MCP server first
2. Copy the backend URL into this UI project’s `.env`
3. Deploy the UI project

## Troubleshooting

- If the UI says the MCP URL is missing, check `.env`
- If tables do not load, confirm the backend is deployed and reachable
- If queries fail, verify the backend still accepts the SQL and the database user is read-only
- If the schema is empty, confirm the selected table exists in the chosen database

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`

