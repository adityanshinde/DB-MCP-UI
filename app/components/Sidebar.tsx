import type { DBType } from '@/types';

type SidebarProps = {
  selectedDB: DBType;
  tables: string[];
  selectedTable: string;
  loadingTables: boolean;
  onDBChange: (db: DBType) => void;
  onLoadTables: () => void;
  onSelectTable: (table: string) => void;
};

export function Sidebar({
  selectedDB,
  tables,
  selectedTable,
  loadingTables,
  onDBChange,
  onLoadTables,
  onSelectTable
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-sky-950/20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Database Explorer</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-100">Connect via MCP</h2>
      </div>

      <label className="space-y-2 text-sm text-slate-300">
        <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Database</span>
        <select
          value={selectedDB}
          onChange={(event) => onDBChange(event.target.value as DBType)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
        >
          <option value="postgres">PostgreSQL</option>
          <option value="mssql">MSSQL</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onLoadTables}
        disabled={loadingTables}
        className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingTables ? 'Loading...' : 'Load Tables'}
      </button>

      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Tables
        </div>
        <div className="max-h-[34rem] overflow-auto p-2">
          {tables.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 px-3 py-6 text-sm text-slate-500">
              No tables loaded yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {tables.map((table) => {
                const isActive = table === selectedTable;
                return (
                  <li key={table}>
                    <button
                      type="button"
                      onClick={() => onSelectTable(table)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? 'border-sky-400 bg-sky-500/10 text-sky-200'
                          : 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      {table}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
