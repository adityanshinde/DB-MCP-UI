'use client';

import { useState } from 'react';
import { exportToCSV, exportToJSON, exportToSQL, copyToClipboard } from '@/lib/exportUtils';

type ExportResultsProps = {
  data: Array<Record<string, unknown>>;
  disabled?: boolean;
};

export function ExportResults({ data, disabled = false }: ExportResultsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasData = data.length > 0;

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToCSV(data, `query_results_${timestamp}.csv`);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToJSON(data, `query_results_${timestamp}.json`);
    setIsOpen(false);
  };

  const handleExportSQL = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToSQL(data, 'imported_data', `query_results_${timestamp}.sql`);
    setIsOpen(false);
  };

  const handleCopyJSON = () => {
    copyToClipboard(JSON.stringify(data, null, 2));
    alert('Copied to clipboard!');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || !hasData}
        className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        title="Export query results"
      >
        📥 Export
      </button>

      {isOpen && hasData && (
        <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded shadow-lg z-50">
          <button
            onClick={handleExportCSV}
            className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors border-b border-slate-700"
          >
            📊 Export as CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors border-b border-slate-700"
          >
            📄 Export as JSON
          </button>
          <button
            onClick={handleExportSQL}
            className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors border-b border-slate-700"
          >
            🔲 Export as SQL INSERT
          </button>
          <button
            onClick={handleCopyJSON}
            className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors"
          >
            📋 Copy JSON to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
