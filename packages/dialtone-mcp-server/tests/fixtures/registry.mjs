// Replace only the external registry request; the built server and SDK stay real.
const scenario = process.env.DIALTONE_TEST_REGISTRY;

function stall(signal, retainHandle = false) {
  return new Promise((resolve, reject) => {
    // A connection handle can survive even after fetch rejects on abort.
    const pending = setInterval(() => {}, 1000);
    const abort = () => {
      if (!retainHandle) clearInterval(pending);
      console.error('[registry fixture] aborted');
      reject(signal.reason);
    };
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });
}

globalThis.fetch = async (url, options = {}) => {
  if (url !== 'https://registry.npmjs.org/@dialpad/dialtone-mcp-server/latest') {
    throw new Error(`Unexpected registry URL: ${url}`);
  }
  if (['stalled-fetch', 'stalled-retained-handle'].includes(scenario)) {
    return stall(options.signal, scenario === 'stalled-retained-handle');
  }
  if (scenario === 'stalled-body') {
    return { ok: true, json: () => stall(options.signal) };
  }
  // Registry responses need not finish before the initialize round trip.
  await new Promise(resolve => setTimeout(resolve, 100));
  const completed = () => setImmediate(() => console.error('[registry fixture] completed'));
  if (scenario === 'offline') {
    completed();
    throw new TypeError('fetch failed');
  }
  if (scenario === 'http-error') {
    return { get ok() { completed(); return false; } };
  }
  const versions = {
    current: process.env.DIALTONE_TEST_VERSION,
    update: '99.0.0',
    missing: undefined,
    numeric: 99,
    invalid: 'not-a-version',
  };
  const response = new Response(scenario === 'invalid-json' ? '{invalid' : JSON.stringify({ version: versions[scenario] }));
  return {
    ok: true,
    async json() {
      try { return await response.json(); }
      finally { completed(); }
    },
  };
};
