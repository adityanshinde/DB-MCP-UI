export function exportToCSV(
  data: Array<Record<string, unknown>>,
  filename = 'export.csv'
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.map((h) => `"${h}"`).join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const value = row[h];
          if (value === null || value === undefined) return '';
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',')
    )
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(
  data: Array<Record<string, unknown>>,
  filename = 'export.json'
): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export function exportToSQL(
  data: Array<Record<string, unknown>>,
  tableName = 'table_name',
  filename = 'export.sql'
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const columns = headers.join(', ');

  const values = data
    .map((row) => {
      const vals = headers
        .map((h) => {
          const value = row[h];
          if (value === null || value === undefined) return 'NULL';
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          }
          if (typeof value === 'boolean') {
            return value ? '1' : '0';
          }
          return String(value);
        })
        .join(', ');
      return `(${vals})`;
    })
    .join(',\n  ');

  const sql = `INSERT INTO ${tableName} (${columns})\nVALUES\n  ${values};`;

  downloadFile(sql, filename, 'text/sql');
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error('Failed to copy:', err);
  });
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
