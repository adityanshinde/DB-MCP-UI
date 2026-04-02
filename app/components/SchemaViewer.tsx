import type { SchemaColumn } from '@/types';

type SchemaViewerProps = {
  tableName: string;
  columns: SchemaColumn[];
  loading: boolean;
};

function columnName(column: SchemaColumn): string {
  return column.column_name || column.COLUMN_NAME || '-';
}

function dataType(column: SchemaColumn): string {
  return column.data_type || column.DATA_TYPE || '-';
}

export function SchemaViewer({ tableName, columns, loading }: SchemaViewerProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-sky-950/20">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Schema Viewer</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">{tableName ? `Table: ${tableName}` : 'Select a table'}</h2>
        </div>
        {loading ? <span className="text-xs text-slate-400">Loading schema...</span> : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-900 text-slate-300">
            <tr>
              <th className="border-b border-slate-800 px-4 py-3 font-medium">column_name</th>
              <th className="border-b border-slate-800 px-4 py-3 font-medium">data_type</th>
            </tr>
          </thead>
          <tbody className="bg-slate-950">
            {columns.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={2}>
                  {tableName ? 'No schema data available.' : 'No table selected.'}
                </td>
              </tr>
            ) : (
              columns.map((column, index) => (
                <tr key={`${columnName(column)}-${index}`} className="border-t border-slate-900">
                  <td className="px-4 py-3 text-slate-200">{columnName(column)}</td>
                  <td className="px-4 py-3 text-slate-400">{dataType(column)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
