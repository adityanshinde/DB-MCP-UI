import { useState, useEffect } from 'react';

export type QueryHistoryItem = {
  id: string;
  query: string;
  database: string;
  timestamp: number;
  executionTime?: number;
  rowCount?: number;
  isFavorite: boolean;
};

const HISTORY_STORAGE_KEY = 'mcp_query_history';
const MAX_HISTORY_ITEMS = 50;

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as QueryHistoryItem[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load query history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save query history:', error);
    }
  }, [history, isLoaded]);

  const addQuery = (query: string, database: string, executionTime?: number, rowCount?: number) => {
    const newItem: QueryHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      query,
      database,
      timestamp: Date.now(),
      executionTime,
      rowCount,
      isFavorite: false
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      // Keep only latest 50 items
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });

    return newItem;
  };

  const toggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getFavorites = () => {
    return history.filter((item) => item.isFavorite);
  };

  const getRecent = (limit = 10) => {
    return history.slice(0, limit);
  };

  return {
    history,
    addQuery,
    toggleFavorite,
    removeItem,
    clearHistory,
    getFavorites,
    getRecent,
    isLoaded
  };
}
