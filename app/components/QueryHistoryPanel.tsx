'use client';

import { useState } from 'react';
import type { QueryHistoryItem } from '@/hooks/useQueryHistory';

type QueryHistoryPanelProps = {
  history: QueryHistoryItem[];
  favorites: QueryHistoryItem[];
  onSelectQuery: (query: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onClearHistory: () => void;
};

export function QueryHistoryPanel({
  history,
  favorites,
  onSelectQuery,
  onToggleFavorite,
  onRemove,
  onClearHistory
}: QueryHistoryPanelProps) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const displayItems = showFavoritesOnly ? favorites : history;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-800 p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-200">Query History</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showFavoritesOnly
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title="Show only favorites"
          >
            ⭐
          </button>
          {!showFavoritesOnly && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-2 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-red-700 hover:text-white transition-colors"
              title="Clear all history"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto flex flex-col gap-1">
        {displayItems.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            {showFavoritesOnly ? 'No favorite queries yet' : 'No query history yet'}
          </p>
        ) : (
          displayItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-2 rounded bg-slate-700 p-2 hover:bg-slate-600 transition-colors cursor-pointer"
              onClick={() => onSelectQuery(item.query)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-slate-200 font-mono">
                  {item.query.substring(0, 50)}
                  {item.query.length > 50 ? '...' : ''}
                </p>
                <div className="flex gap-2 text-xs text-slate-400 mt-1">
                  <span>{item.database}</span>
                  <span>•</span>
                  <span>{formatTime(item.timestamp)}</span>
                  {item.executionTime && (
                    <>
                      <span>•</span>
                      <span>{item.executionTime}ms</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="p-1 rounded hover:bg-yellow-600 transition-colors"
                  title={item.isFavorite ? 'Remove favorite' : 'Add favorite'}
                >
                  {item.isFavorite ? '⭐' : '☆'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="p-1 rounded hover:bg-red-700 transition-colors text-red-400"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
