import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

test('runner preserves the setup error when cleanup and report writing also fail', () => {
  const require = createRequire(
    new URL('../../packages/dialtone-mcp-server/package.json', import.meta.url),
  );
  const client = pathToFileURL(
    require.resolve('@modelcontextprotocol/sdk/client/index.js'),
  ).href;
  const preload = `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { Client } from ${JSON.stringify(client)};
    fs.promises.mkdtemp = async () => { throw new Error('setup failed'); };
    fs.promises.writeFile = async () => { throw new Error('report failed'); };
    syncBuiltinESMExports();
    Client.prototype.close = async () => { throw new Error('close failed'); };
  `;
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript,${encodeURIComponent(preload)}`,
      fileURLToPath(new URL('run.mjs', import.meta.url)),
      '--report',
      'unused-report.json',
    ],
    { encoding: 'utf8', timeout: 10000 },
  );
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /client\.close failed: close failed/);
  assert.match(result.stderr, /report write failed: report failed/);
  assert.match(result.stderr, /Error: setup failed\n/);
});
