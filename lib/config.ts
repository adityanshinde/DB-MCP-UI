import type { DBType } from '@/types';

export const CONFIG: {
  mcpBaseUrl: string;
  defaultDB: DBType;
  maxRows: number;
} = {
  mcpBaseUrl: process.env.NEXT_PUBLIC_MCP_URL || '',
  defaultDB: 'postgres',
  maxRows: 50
};
