'use client';

import { useState, useEffect } from 'react';
import { DBType } from '@/types';

export interface QueryHistoryItem {
  id: string;
  query: string;
  db: DBType;
  timestamp: number;
  executionTime?: number;
  rowCount?: number;
  isFavorite: boolean;
}

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('query-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('query-history', JSON.stringify(history));
  }, [history]);

  function addQuery(query: string, db: DBType, executionTime?: number, rowCount?: number) {
    const newItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query,
      db,
      timestamp: Date.now(),
      executionTime,
      rowCount,
      isFavorite: false
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      // Keep only last 50 queries
      return updated.slice(0, 50);
    });
  }

  function toggleFavorite(id: string) {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }

  function deleteQuery(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }

  function clearHistory() {
    setHistory([]);
  }

  return {
    history,
    addQuery,
    toggleFavorite,
    deleteQuery,
    clearHistory
  };
}
