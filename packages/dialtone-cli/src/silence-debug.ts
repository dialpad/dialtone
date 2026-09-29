// Suppress console.error debug logging from the core search functions.
// The core was designed for the MCP server where stderr is invisible to
// the client. In a CLI, stderr goes to the terminal, so we silence it.

const originalError = console.error;

// Matches the complete debug tags used by dialtone-query-core:
// [CLASS SEARCH DEBUG], [TOKEN SEARCH DEBUG], [COMPONENT SEARCH DEBUG],
// [ICON SEARCH DEBUG], [FILTER]
// Full tags only, so a future [... ERROR] or [... WARNING] line still prints.
const CORE_DEBUG_PREFIX = /^\n?\[(CLASS SEARCH DEBUG|TOKEN SEARCH DEBUG|COMPONENT SEARCH DEBUG|ICON SEARCH DEBUG|FILTER)\]/;

export function silenceDebug() {
  // DIALTONE_DEBUG=1 keeps the debug output, e.g. to see how a search ranked its results.
  if (process.env.DIALTONE_DEBUG === '1') return;

  console.error = (...args: unknown[]) => {
    const first = String(args[0] ?? '');
    if (CORE_DEBUG_PREFIX.test(first)) return;
    originalError(...args);
  };
}

export function restoreDebug() {
  console.error = originalError;
}
