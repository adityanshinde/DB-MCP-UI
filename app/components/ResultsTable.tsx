type ResultsTableProps = {
  rows: Array<Record<string, unknown>>;
  error: string;
  loading: boolean;
};

function formatCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function ResultsTable({ rows, error, loading }: ResultsTableProps) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-sky-950/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Results</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Query output</h2>
        </div>
        {loading ? <span className="text-xs text-slate-400">Loading results...</span> : null}
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-900/60 bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <div className="max-h-[24rem] overflow-auto">
          {rows.length === 0 ? (
            <div className="px-4 py-8 text-sm text-slate-500">No results to display.</div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-slate-900 text-slate-300">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="border-b border-slate-800 px-4 py-3 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-slate-950">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-slate-900 hover:bg-slate-900/40">
                    {columns.map((column) => (
                      <td key={`${rowIndex}-${column}`} className="px-4 py-3 align-top text-slate-200">
                        <span className="break-words">{formatCell(row[column])}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
