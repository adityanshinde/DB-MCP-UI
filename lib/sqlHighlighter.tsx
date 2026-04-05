import { useState, useRef, useEffect } from 'react';

// Simple SQL syntax highlighting
function highlightSQL(sql: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'ORDER', 'BY', 'GROUP',
    'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'NULL', 'IS', 'EXISTS',
    'CREATE', 'TABLE', 'DROP', 'ALTER', 'INSERT', 'UPDATE', 'DELETE'
  ];

  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  const stringPattern = /'([^']|\\')*'/g;
  const numberPattern = /\b\d+\b/g;
  const commentPattern = /--.*/g;

  let highlighted = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments (gray)
  highlighted = highlighted.replace(commentPattern, '<span class="text-slate-500">$&</span>');

  // Strings (green)
  highlighted = highlighted.replace(stringPattern, '<span class="text-green-400">$&</span>');

  // Numbers (cyan)
  highlighted = highlighted.replace(numberPattern, '<span class="text-cyan-400">$&</span>');

  // Keywords (blue)
  highlighted = highlighted.replace(keywordPattern, '<span class="text-blue-400 font-semibold">$&</span>');

  return highlighted;
}

type SQLEditorWithHighlightProps = {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  loading: boolean;
  placeholder?: string;
};

export function SQLEditorWithHighlight({
  value,
  onChange,
  onRun,
  loading,
  placeholder = 'SELECT * FROM table_name LIMIT 10'
}: SQLEditorWithHighlightProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to run query
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }

    // Tab to insert spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* Highlight layer */}
      <div
        ref={highlightRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <pre
          className="p-4 font-mono text-sm leading-6 text-transparent"
          dangerouslySetInnerHTML={{ __html: highlightSQL(value || placeholder) }}
        />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="relative w-full min-h-40 p-4 font-mono text-sm leading-6 text-slate-100 bg-transparent outline-none resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}
