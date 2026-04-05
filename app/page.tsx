'use client';

import { useMemo, useState } from 'react';

import { CONFIG } from '@/lib/config';
import { useMCP } from '@/hooks/useMCP';
import { useQueryHistory } from '@/hooks/useQueryHistory';
import type { DBType, QueryResultPayload, SchemaColumn, StoredProcedureInfo, DatabaseCredentials } from '@/types';
import { QueryEditor } from '@/app/components/QueryEditor';
import { ResultsTable } from '@/app/components/ResultsTable';
import { ProceduresList } from '@/app/components/ProceduresList';
import { SchemaViewer } from '@/app/components/SchemaViewer';
import { Sidebar } from '@/app/components/Sidebar';
import { CredentialsPanel } from '@/app/components/CredentialsPanel';
import { QueryHistoryPanel } from '@/app/components/QueryHistoryPanel';
import { ExportResults } from '@/app/components/ExportResults';

const DEFAULT_QUERY = 'SELECT * FROM table_name LIMIT 10';

export default function Page() {
  const { callMCP } = useMCP();
  const { history, addQuery, toggleFavorite, removeItem, clearHistory, getFavorites, isLoaded } = useQueryHistory();
  
  const [credentials, setCredentials] = useState<DatabaseCredentials | null>(null);
  const [selectedDB, setSelectedDB] = useState<DBType>(CONFIG.defaultDB);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [schema, setSchema] = useState<SchemaColumn[]>([]);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [procedures, setProcedures] = useState<StoredProcedureInfo[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const activeLoading = loadingTables || loadingSchema || loadingQuery;
  const schemaTitle = useMemo(() => selectedTable || '', [selectedTable]);
  const favorites = getFavorites();

  async function handleTestConnection() {
    if (!credentials) {
      alert('Please configure credentials first');
      return;
    }

    setTestingConnection(true);
    setError('');

    const response = await callMCP('list_tables', { db: credentials.type }, credentials);

    setTestingConnection(false);

    if (!response.success) {
      setError(`Connection failed: ${response.error}`);
      alert(`Connection failed: ${response.error}`);
    } else {
      alert('Connection successful!');
    }
  }

  async function handleLoadTables() {
    setError('');
    setLoadingTables(true);
    setSchema([]);
    setResults([]);
    setSelectedTable('');

    const response = await callMCP('list_tables', { db: selectedDB }, credentials || undefined);
    setLoadingTables(false);

    if (!response.success) {
      setTables([]);
      setError(response.error || 'Failed to load tables.');
      return;
    }

    const payload = response.data as { tables?: string[] } | null;
    setTables(payload?.tables || []);
  }

  async function handleSelectTable(table: string) {
    setError('');
    setSelectedTable(table);
    setLoadingSchema(true);

    const response = await callMCP('get_table_schema', {
      db: selectedDB,
      table
    }, credentials || undefined);

    setLoadingSchema(false);

    if (!response.success) {
      setSchema([]);
      setError(response.error || 'Failed to load schema.');
      return;
    }

    const payload = response.data as { columns?: SchemaColumn[] } | null;
    setSchema(payload?.columns || []);
  }

  async function handleRunQuery() {
    setError('');
    setLoadingQuery(true);
    const startTime = Date.now();

    const response = await callMCP('run_query', {
      db: selectedDB,
      query
    }, credentials || undefined);

    const executionTime = Date.now() - startTime;
    setLoadingQuery(false);

    if (!response.success) {
      setResults([]);
      setError(response.error || 'Query failed.');
      return;
    }

    const payload = response.data as QueryResultPayload | null;
    const rowCount = payload?.rows?.length || 0;
    setResults(payload?.rows || []);

    // Add to history
    if (isLoaded) {
      addQuery(query, selectedDB, executionTime, rowCount);
    }
  }

  function handleDBChange(db: DBType) {
    setSelectedDB(db);
    setTables([]);
    setSelectedTable('');
    setSchema([]);
    setResults([]);
    setProcedures([]);
    setError('');
  }

  async function handleLoadProcedures() {
    setError('');
    setLoadingProcedures(true);

    const response = await callMCP('list_stored_procedures', {
      db: selectedDB
    } as never, credentials || undefined);

    setLoadingProcedures(false);

    if (!response.success) {
      setProcedures([]);
      setError(response.error || 'Failed to load stored procedures.');
      return;
    }

    const payload = response.data as { procedures?: StoredProcedureInfo[] } | null;
    setProcedures(payload?.procedures || []);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <CredentialsPanel
        credentials={credentials}
        onCredentialsChange={setCredentials}
        onTestConnection={handleTestConnection}
        isTestingConnection={testingConnection}
      />

      <div className="min-h-screen p-4 md:p-6">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col gap-4">
          <header className="rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 shadow-2xl shadow-sky-950/20">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">MCP UI Dashboard</p>
              <h1 className="text-2xl font-semibold md:text-3xl">Explore schemas and run queries through MCP</h1>
              <p className="text-sm text-slate-400">
                Connected via <span className="text-slate-200">NEXT_PUBLIC_MCP_URL</span>. {activeLoading ? 'Loading...' : 'Ready.'}
              </p>
            </div>
          </header>

          {error ? (
            <div className="rounded-2xl border border-red-900/60 bg-red-950/60 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="flex flex-col gap-4">
              <Sidebar
                selectedDB={selectedDB}
                tables={tables}
                selectedTable={selectedTable}
                loadingTables={loadingTables}
                onDBChange={handleDBChange}
                onLoadTables={handleLoadTables}
                onSelectTable={handleSelectTable}
              />
              {isLoaded && (
                <QueryHistoryPanel
                  history={history}
                  favorites={favorites}
                  onSelectQuery={setQuery}
                  onToggleFavorite={toggleFavorite}
                  onRemove={removeItem}
                  onClearHistory={clearHistory}
                />
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <QueryEditor query={query} loading={loadingQuery} onQueryChange={setQuery} onRun={handleRunQuery} />
              
              <div className="flex gap-2 items-center">
                <ExportResults data={results} disabled={loadingQuery || results.length === 0} />
                {results.length > 0 && (
                  <span className="text-sm text-slate-400">
                    {results.length} row{results.length !== 1 ? 's' : ''} returned
                  </span>
                )}
              </div>

              <SchemaViewer tableName={schemaTitle} columns={schema} loading={loadingSchema} />
              <ResultsTable rows={results} error={error} loading={loadingQuery} />
              <ProceduresList
                db={selectedDB}
                procedures={procedures}
                loading={loadingProcedures}
                error={error}
                onReload={handleLoadProcedures}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
