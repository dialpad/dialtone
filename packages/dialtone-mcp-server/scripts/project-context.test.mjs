import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createConsumerFixture } from '../../../scripts/retrieval/fixtures.mjs';

test('configured legacy data with verified exports does not acquire bundled Text APIs', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'dialtone-project-context-'));
  let client;
  try {
    // C5 declarations with synthetic lookup data; this is not a consumer build.
    const fixture = await createConsumerFixture(parent, 'dt9-legacy', {
      packages: {
        '@dialpad/dialtone': {
          'dist/vue3/component-documentation.json': [{ displayName: 'DtButton', props: [{ name: 'legacy-prop' }] }],
        },
      },
    });
    const pkg = join(fixture.dependencyRoot, 'node_modules/@dialpad/dialtone');
    const manifestPath = join(pkg, 'package.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.exports['./vue'] = './dist/vue3/entry.js';
    await writeFile(manifestPath, JSON.stringify(manifest));
    await writeFile(join(pkg, 'dist/vue3/entry.js'), 'import button from \'./button.js\'; export { button as DtButton, button as DtBreadcrumbItem };\n');
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [fileURLToPath(new URL('../build/index.js', import.meta.url))],
      cwd: fixture.dependencyRoot,
      env: {
        ...process.env,
        DIALTONE_PROJECT_ROOT: fixture.dependencyRoot,
        DIALTONE_LOOKUP_ROOT: fixture.dependencyRoot,
      },
      stderr: 'pipe',
    });
    client = new Client({ name: 'dialtone-installed-project-test', version: '1.0.0' });
    await client.connect(transport);
    const result = await client.callTool({ name: 'get_component', arguments: { component: 'DtText' } });
    assert.equal(result.structuredContent.match, 'unavailable');
    assert.deepEqual(result.structuredContent.items, []);
    assert.equal(result.structuredContent.source.domains.components.version, '9.185.0');
    const missingMetadata = await client.callTool({ name: 'get_component', arguments: { component: 'DtBreadcrumbItem' } });
    assert.equal(missingMetadata.structuredContent.match, 'unverified');
    assert.deepEqual(missingMetadata.structuredContent.items, []);
    const button = await client.callTool({ name: 'get_component', arguments: { component: 'DtButton', projection: 'props' } });
    assert.equal(button.structuredContent.items[0].contract.name, 'legacy-prop');
    const resource = await client.readResource({ uri: 'dialtone://components' });
    assert.deepEqual(JSON.parse(resource.contents[0].text).map(record => record.displayName), ['DtButton']);
    assert.equal(resource._meta.dialtone.source.hash, result.structuredContent.source.domains.components.hash);
  } finally {
    await client?.close();
    await rm(parent, { recursive: true, force: true, maxRetries: 3 });
  }
});
