// Suppress console.error debug logging from the core search functions.
// The core was designed for the MCP server where stderr is invisible to
// the client. In a CLI, stderr goes to the terminal, so we silence it.

const originalError = console.error;

// Matches the specific debug prefixes used by dialtone-query-core:
// [CLASS SEARCH DEBUG], [TOKEN SEARCH DEBUG], [COMPONENT SEARCH DEBUG],
// [ICON SEARCH DEBUG], [FILTER], [INIT]
const CORE_DEBUG_PREFIX = /^\n?\[(CLASS SEARCH|TOKEN SEARCH|COMPONENT SEARCH|ICON SEARCH|FILTER|INIT)\]/;

export function silenceDebug() {
  console.error = (...args: unknown[]) => {
    const first = String(args[0] ?? '');
    if (CORE_DEBUG_PREFIX.test(first)) return;
    originalError(...args);
  };
}

export function restoreDebug() {
  console.error = originalError;
}
