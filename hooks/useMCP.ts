import { CONFIG } from '@/lib/config';
import type { MCPResponse } from '@/types';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

export function useMCP() {
  async function callMCP(tool: string, input: unknown): Promise<MCPResponse> {
    if (!CONFIG.mcpBaseUrl) {
      return {
        success: false,
        data: null,
        error: 'NEXT_PUBLIC_MCP_URL is not configured.'
      };
    }

    try {
      const response = await fetch(`${normalizeBaseUrl(CONFIG.mcpBaseUrl)}/api/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tool, input }),
        cache: 'no-store'
      });

      const data = (await response.json()) as MCPResponse;

      if (!response.ok) {
        return {
          success: false,
          data: null,
          error: data?.error || `Request failed with status ${response.status}`
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unable to reach MCP server.'
      };
    }
  }

  return { callMCP };
}
