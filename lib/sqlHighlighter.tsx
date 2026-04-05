'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SQLEditorWithHighlightProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  loading?: boolean;
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
  'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'DATABASE', 'INDEX',
  'PRIMARY', 'KEY', 'CONSTRAINT', 'UNIQUE', 'NOT', 'NULL', 'DEFAULT', 'CHECK',
  'AND', 'OR', 'IN', 'BETWEEN', 'LIKE', 'IS', 'AS', 'DISTINCT', 'ALL', 'CASE',
  'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'UNION', 'INTERSECT', 'EXCEPT', 'CAST'
];

function highlightSQL(code: string): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  let lastIndex = 0;

  // Pattern: keywords, strings, numbers, comments
  const patterns = [
    { regex: /--[^\n]*/g, className: 'text-slate-500', name: 'comment' }, // Line comment
    { regex: /\/\*[\s\S]*?\*\//g, className: 'text-slate-500', name: 'blockComment' }, // Block comment
    { regex: /'([^'\\]|\\.)*'/g, className: 'text-emerald-400', name: 'string' }, // Single-quoted string
    { regex: /"([^"\\]|\\.)*"/g, className: 'text-emerald-400', name: 'string' }, // Double-quoted string
    { regex: /\b(?:0x[0-9a-fA-F]+|\d+\.?\d*|\.\d+)\b/g, className: 'text-rose-400', name: 'number' }, // Numbers
    { regex: new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi'), className: 'text-blue-400', name: 'keyword' }
  ];

  const matches: Array<{ start: number; end: number; className: string }> = [];

  for (const pattern of patterns) {
    let match;
    pattern.regex.lastIndex = 0;
    while ((match = pattern.regex.exec(code)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        className: pattern.className
      });
    }
  }

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Merge overlapping matches (keep first match)
  const merged: Array<{ start: number; end: number; className: string }> = [];
  for (const match of matches) {
    if (!merged.some((m) => m.start <= match.start && match.start < m.end)) {
      merged.push(match);
    }
  }

  let keyIndex = 0;
  for (const match of merged) {
    if (lastIndex < match.start) {
      elements.push(
        <span key={keyIndex++}>{code.substring(lastIndex, match.start)}</span>
      );
    }
    elements.push(
      <span key={keyIndex++} className={match.className}>
        {code.substring(match.start, match.end)}
      </span>
    );
    lastIndex = match.end;
  }

  if (lastIndex < code.length) {
    elements.push(
      <span key={keyIndex}>{code.substring(lastIndex)}</span>
    );
  }

  return elements.length > 0 ? elements : [<span key="0">{code}</span>];
}

export function SQLEditorWithHighlight({
  value,
  onChange,
  onRun,
  loading
}: SQLEditorWithHighlightProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedLines, setHighlightedLines] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    setHighlightedLines(highlightSQL(value));
  }, [value]);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '\t' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-sky-950/20 overflow-hidden">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Query Editor</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Run safe read-only SQL through MCP</h2>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          title="Ctrl+Enter to run"
        >
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="relative min-h-40 w-full resize-none rounded-2xl border border-slate-700 bg-transparent px-4 py-3 font-mono text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 z-10"
          placeholder="SELECT * FROM table_name LIMIT 10"
          style={{
            background: 'transparent',
            color: 'transparent',
            caretColor: 'white',
            resize: 'none'
          }}
        />
        <div
          ref={highlightRef}
          className="absolute inset-0 min-h-40 rounded-2xl bg-slate-900 px-4 py-3 font-mono text-sm leading-6 text-slate-100 pointer-events-none overflow-auto whitespace-pre-wrap break-words"
          style={{ wordBreak: 'break-word' }}
        >
          {highlightedLines}
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        <span className="mr-3">💡 Ctrl+Enter to run</span>
        <span>⇥ Tab for indent</span>
      </div>
    </div>
  );
}
