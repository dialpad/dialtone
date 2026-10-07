import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSONRPCMessageSchema } from '@modelcontextprotocol/sdk/types.js';

const server = fileURLToPath(new URL('../build/index.js', import.meta.url));
const registryFixture = fileURLToPath(new URL('./fixtures/registry.mjs', import.meta.url));
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
// Includes process creation, bundled-data loading and the initialize round trip.
const initializeBoundMs = 3000;
const shutdownBoundMs = 1000;

function bounded(promise, milliseconds, message) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error(message)), milliseconds);
    }),
  ]).finally(() => clearTimeout(timeout));
}

function registryDiagnostic(scenario, waitForTimeout) {
  if (waitForTimeout) return '[registry fixture] aborted';
  if (scenario.startsWith('stalled')) return;
  return { update: 'Update Available', current: 'up to date' }[scenario] ?? '[registry fixture] completed';
}

async function probe(t, scenario, { waitForTimeout = false, signal } = {}) {
  const started = performance.now();
  const child = spawn(process.execPath, ['--import', registryFixture, server], {
    env: { ...process.env, DIALTONE_TEST_REGISTRY: scenario, DIALTONE_TEST_VERSION: version },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const closed = once(child, 'close');
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill('SIGKILL');
      await closed;
    }
  });
  const lines = createInterface({ input: child.stdout });
  let stderr = '';
  const stdout = [];
  const invalidLines = [];
  child.stderr.on('data', chunk => { stderr += chunk; });
  const initialized = new Promise((resolve) => {
    lines.on('line', line => {
      try {
        const message = JSON.parse(line);
        stdout.push(message);
        if (message.id === 1) resolve(message);
      } catch {
        invalidLines.push(line);
      }
    });
  });
  child.stdin.write(JSON.stringify({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'startup-test', version: '1.0.0' } },
  }) + '\n');
  const response = await bounded(initialized, initializeBoundMs, `initialize exceeded ${initializeBoundMs}ms`);
  const initializeMs = Math.round(performance.now() - started);
  assert.equal(response.jsonrpc, '2.0');
  assert.equal(response.result?.serverInfo.version, version);
  assert.equal(response.result?.protocolVersion, '2025-06-18');
  if (scenario.startsWith('stalled')) {
    assert.doesNotMatch(stderr, /\[registry fixture\] aborted/, 'initialize must precede the registry deadline');
  }
  child.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n');
  const expected = registryDiagnostic(scenario, waitForTimeout);
  if (expected) {
    await bounded(new Promise(resolve => {
      const check = () => { if (stderr.includes(expected)) resolve(); };
      child.stderr.on('data', check);
      check();
    }), 2500, `registry check did not reach ${expected}`);
  }
  const shutdownStarted = performance.now();
  if (signal) child.kill(signal);
  else child.stdin.end();
  const [code, exitSignal] = await bounded(closed, shutdownBoundMs, `shutdown exceeded ${shutdownBoundMs}ms`);
  assert.equal(code, 0);
  assert.equal(exitSignal, null);
  assert.deepEqual(invalidLines, [], 'stdout must contain only JSON-RPC');
  stdout.forEach(message => JSONRPCMessageSchema.parse(message));
  assert.equal(stdout.filter(message => message.id === 1).length, 1);
  t.diagnostic(`${scenario}: initialize ${initializeMs}ms; shutdown ${Math.round(performance.now() - shutdownStarted)}ms`);
  return stderr;
}

for (const scenario of ['stalled-fetch', 'stalled-body']) {
  test(`${scenario} cannot delay initialize and is aborted after two seconds`, { timeout: 7000 }, async t => {
    const stderr = await probe(t, scenario, { waitForTimeout: true });
    assert.doesNotMatch(stderr, /Update Available|up to date/);
  });
}

for (const scenario of ['offline', 'http-error', 'invalid-json', 'missing', 'numeric', 'invalid']) {
  test(`${scenario} leaves initialize available without an update notice`, { timeout: 5000 }, async t => {
    const stderr = await probe(t, scenario);
    assert.match(stderr, /\[registry fixture\] completed/);
    assert.doesNotMatch(stderr, /Update Available|Latest:|up to date/);
  });
}

test('valid update and current-version notices stay on stderr', { timeout: 8000 }, async t => {
  const updateNotice = await probe(t, 'update');
  assert.match(updateNotice, /Update Available[\s\S]*Latest: {2}v99\.0\.0/);
  assert.match(updateNotice, /1\. npm install -D @dialpad\/dialtone-mcp-server@latest/);
  assert.match(updateNotice, /2\. Restart this conversation/);
  assert.match(await probe(t, 'current'), /up to date/);
});

for (const signal of [undefined, 'SIGINT', 'SIGTERM']) {
  test(`shutdown via ${signal ?? 'stdin EOF'} exits when an aborted update retains a handle`,
    { timeout: 5000 }, async t => {
      const stderr = await probe(t, 'stalled-retained-handle', { signal });
      assert.match(stderr, /\[registry fixture\] aborted/);
    });
}
