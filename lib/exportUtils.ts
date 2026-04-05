export function exportToCSV(data: Array<Record<string, unknown>>, filename: string = 'export.csv') {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      const stringValue = value === null || value === undefined ? '' : String(value);
      // Escape quotes and wrap in quotes if contains comma, newline, or quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(data: Array<Record<string, unknown>>, filename: string = 'export.json') {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export function exportToSQLInsert(
  data: Array<Record<string, unknown>>,
  tableName: string = 'table_name',
  filename: string = 'export.sql'
) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const statements = data.map((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) {
        return 'NULL';
      }
      if (typeof value === 'boolean') {
        return value ? '1' : '0';
      }
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return String(value);
    });
    return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`;
  });

  const sql = statements.join('\n');
  downloadFile(sql, filename, 'text/sql');
}

export function copyToClipboard(data: Array<Record<string, unknown>>, format: 'csv' | 'json' | 'table' = 'table') {
  if (data.length === 0) {
    alert('No data to copy');
    return;
  }

  let text = '';

  if (format === 'csv') {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return value === null || value === undefined ? '' : String(value);
      })
    );
    text = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  } else if (format === 'json') {
    text = JSON.stringify(data, null, 2);
  } else {
    // table format - tab-separated
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return value === null || value === undefined ? '' : String(value);
      })
    );
    text = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  }

  navigator.clipboard.writeText(text).then(
    () => {
      alert('Copied to clipboard!');
    },
    () => {
      alert('Failed to copy to clipboard');
    }
  );
}

function downloadFile(content: string, filename: string, mimeType: string) {
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
