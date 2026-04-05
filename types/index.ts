export type DBType = 'postgres' | 'mssql';

export type MCPResponse<T = unknown> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export type TableInfo = {
  tableName?: string;
  tablename?: string;
  TABLE_NAME?: string;
};

export type SchemaColumn = {
  column_name?: string;
  data_type?: string;
  is_nullable?: string;
  column_default?: string | null;
  ordinal_position?: number;
  COLUMN_NAME?: string;
  DATA_TYPE?: string;
};

export type QueryResultPayload = {
  metadata?: {
    db: DBType;
    rows: number;
    columns: string[];
    query: string;
  };
  rows?: Array<Record<string, unknown>>;
};

export type StoredProcedureInfo = {
  schema: string;
  name: string;
};
