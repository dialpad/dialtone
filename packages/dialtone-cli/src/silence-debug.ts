// Suppress console.error debug logging from the core search functions.
// The core was designed for the MCP server where stderr is invisible to
// the client. In a CLI, stderr goes to the terminal, so we silence it.

const originalError = console.error;

export function silenceDebug() {
  console.error = (...args: unknown[]) => {
    const first = String(args[0] ?? '');
    // Swallow lines from core search/filter debug logging
    if (first.startsWith('[') || first.startsWith('\n[')) return;
    originalError(...args);
  };
}

export function restoreDebug() {
  console.error = originalError;
}
