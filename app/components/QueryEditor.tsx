'use client';

import { SQLEditorWithHighlight } from '@/lib/sqlHighlighter';

type QueryEditorProps = {
  query: string;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onRun: () => void;
};

export function QueryEditor({ query, loading, onQueryChange, onRun }: QueryEditorProps) {
  return (
    <section>
      <SQLEditorWithHighlight
        value={query}
        onChange={onQueryChange}
        onRun={onRun}
        loading={loading}
      />
    </section>
  );
}
