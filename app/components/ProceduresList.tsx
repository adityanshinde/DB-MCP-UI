import type { DBType, StoredProcedureInfo } from '@/types';

type ProceduresListProps = {
  db: DBType;
  procedures: StoredProcedureInfo[];
  loading: boolean;
  error: string;
  onReload: () => void;
};

export function ProceduresList({ db, procedures, loading, error, onReload }: ProceduresListProps) {
  return (
    <section className="flex min-h-[260px] flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Procedures</p>
          <h2 className="text-sm font-semibold text-slate-100">Stored procedures in {db.toUpperCase()}</h2>
        </div>
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Reload'}
        </button>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-900/60 bg-red-950/60 px-3 py-2 text-xs text-red-200">{error}</div>
      ) : null}

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
        <div className="max-h-64 overflow-auto text-xs text-slate-200">
          {procedures.length === 0 ? (
            <div className="px-4 py-6 text-slate-500">No stored procedures found.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {procedures.map((proc) => (
                <li key={`${proc.schema}.${proc.name}`} className="px-4 py-2">
                  <span className="text-slate-400">{proc.schema}.</span>
                  <span className="font-mono">{proc.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

