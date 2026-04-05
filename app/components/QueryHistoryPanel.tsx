import type { QueryHistoryItem } from '@/hooks/useQueryHistory';

interface QueryHistoryPanelProps {
  history: QueryHistoryItem[];
  onSelectQuery: (query: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteQuery: (id: string) => void;
  onClearHistory: () => void;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function QueryHistoryPanel({
  history,
  onSelectQuery,
  onToggleFavorite,
  onDeleteQuery,
  onClearHistory
}: QueryHistoryPanelProps) {
  const favorites = history.filter((item) => item.isFavorite);
  const recent = history.filter((item) => !item.isFavorite);

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center text-slate-400">
        No queries yet. Run a query to see history.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      {favorites.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Favorites</h3>
          <div className="space-y-2">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 p-2"
              >
                <button
                  onClick={() => onSelectQuery(item.query)}
                  className="flex-1 text-left text-xs font-mono text-slate-300 line-clamp-2 hover:text-slate-100"
                >
                  {item.query}
                </button>
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className="flex-shrink-0 text-amber-400 hover:text-amber-300"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 max-h-96 overflow-y-auto">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Recent</h3>
          <div className="space-y-2">
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 p-2 group"
              >
                <button
                  onClick={() => onSelectQuery(item.query)}
                  className="flex-1 text-left"
                >
                  <div className="text-xs font-mono text-slate-300 line-clamp-1 hover:text-slate-100">
                    {item.query}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.db} • {formatTime(item.timestamp)}
                    {item.executionTime && ` • ${item.executionTime}ms`}
                    {item.rowCount !== undefined && ` • ${item.rowCount} rows`}
                  </div>
                </button>
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition"
                >
                  ☆
                </button>
                <button
                  onClick={() => onDeleteQuery(item.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={onClearHistory}
          className="w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
        >
          Clear History
        </button>
      )}
    </section>
  );
}
