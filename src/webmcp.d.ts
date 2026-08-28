interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: any, context: { signal: AbortSignal }) => Promise<string> | string;
}

interface ModelContext {
  registerTool(tool: WebMCPTool, options?: { signal?: AbortSignal }): Promise<void>;
}

interface Document {
  modelContext?: ModelContext;
}
