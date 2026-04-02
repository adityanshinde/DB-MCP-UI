type QueryEditorProps = {
  query: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onRun: () => void;
};

export function QueryEditor({ query, loading, onQueryChange, onRun }: QueryEditorProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-sky-950/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Query Editor</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Run safe read-only SQL through MCP</h2>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      <textarea
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        spellCheck={false}
        className="min-h-40 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400"
        placeholder="SELECT * FROM table_name LIMIT 10"
      />
    </section>
  );
}
