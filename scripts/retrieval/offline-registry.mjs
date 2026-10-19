// Only optional update-check I/O is disabled. Retrieval still crosses the actual CLI/MCP adapters.
// Startup/network behavior is covered separately by DLT-3655, not by this retrieval harness.
globalThis.fetch = async () => {
  throw new Error(
    'Registry access disabled by deterministic retrieval harness',
  );
};
