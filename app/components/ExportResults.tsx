'use client';

import { useState } from 'react';
import { exportToCSV, exportToJSON, exportToSQLInsert, copyToClipboard } from '@/lib/exportUtils';

interface ExportResultsProps {
  data: Array<Record<string, unknown>>;
  tableName?: string;
}

export function ExportResults({ data, tableName = 'results' }: ExportResultsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (data.length === 0) {
    return null;
  }

  const timestamp = new Date().toISOString().split('T')[0];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
      >
        ↓ Export ({data.length} rows)
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-700 bg-slate-900 shadow-lg z-10">
          <button
            onClick={() => {
              exportToCSV(data, `${tableName}_${timestamp}.csv`);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-800 first:rounded-t-lg"
          >
            📄 CSV
          </button>
          <button
            onClick={() => {
              exportToJSON(data, `${tableName}_${timestamp}.json`);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
          >
            {} JSON
          </button>
          <button
            onClick={() => {
              exportToSQLInsert(data, tableName, `${tableName}_${timestamp}.sql`);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
          >
            ⌨️ SQL INSERT
          </button>
          <button
            onClick={() => {
              copyToClipboard(data, 'table');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-800 last:rounded-b-lg"
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  );
}
