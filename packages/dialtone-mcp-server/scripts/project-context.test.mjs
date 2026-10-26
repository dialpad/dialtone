import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createConsumerFixture } from '../../../scripts/retrieval/fixtures.mjs';

test('tools and resources share installed data and preserve availability routing', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'dialtone-project-context-'));
  let client;
  try {
    // C5 declarations with synthetic lookup data; this is not a consumer build.
    const fixture = await createConsumerFixture(parent, 'dt9-legacy', {
      packages: {
        '@dialpad/dialtone': {
          'dist/vue3/component-documentation.json': [
            { displayName: 'DtButton', props: [{ name: 'legacy-prop' }] },
            { displayName: 'DtToggle' },
          ],
        },
      },
    });
    const pkg = join(fixture.dependencyRoot, 'node_modules/@dialpad/dialtone');
    const manifestPath = join(pkg, 'package.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest.exports['./vue'] = './dist/vue3/entry.js';
    await writeFile(manifestPath, JSON.stringify(manifest));
    await writeFile(join(pkg, 'dist/vue3/entry.js'), 'import button from \'./button.js\'; export { button as DtButton, button as DtToggle, button as ARROW_KEYS };\n');
    const projectManifest = join(fixture.dependencyRoot, 'package.json');
    const project = JSON.parse(await readFile(projectManifest, 'utf8'));
    project.dependencies['@dialpad/dialtone'] = '^10';
    await writeFile(projectManifest, JSON.stringify(project));
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
    let diagnostics = '';
    transport.stderr.on('data', chunk => { diagnostics += chunk; });
    client = new Client({ name: 'dialtone-installed-project-test', version: '1.0.0' });
    await client.connect(transport);
    assert.match(diagnostics, /\[DATA\].*9\.185\.0.*Reinstall dependencies/);
    const result = await client.callTool({ name: 'get_component', arguments: { component: 'DtText' } });
    assert.equal(result.structuredContent.match, 'unavailable');
    assert.deepEqual(result.structuredContent.items, []);
    assert.equal(result.structuredContent.continuation, null);
    assert.equal(result.structuredContent.source.domains.components.version, '9.185.0');
    for (const [component, match] of [
      ['v-dt-tooltip', 'no-match'], ['ARROW_KEYS', 'unverified'],
    ]) {
      const routed = await client.callTool({ name: 'get_component', arguments: { component } });
      assert.equal(routed.structuredContent.match, match);
      assert.equal(routed.structuredContent.continuation.tool, 'search_components');
      assert.deepEqual(routed.structuredContent.items, []);
    }
    const button = await client.callTool({ name: 'get_component', arguments: { component: 'DtButton', projection: 'props' } });
    assert.equal(button.structuredContent.items[0].contract.name, 'legacy-prop');
    const keyword = await client.callTool({ name: 'search_components', arguments: { query: 'switch' } });
    assert.match(keyword.content.map(item => item.text).join('\n'), /\*\*DtToggle\*\*/);
    assert.match(keyword.content[0].text, /9\.185\.0.*Reinstall dependencies/);
    for (const [name, args] of [
      ['search_documentation', { query: 'button' }],
      ['search_tokens', { query: '--dt-color-black-1000', projection: 'themes' }],
    ]) {
      const response = await client.callTool({ name, arguments: args });
      assert.match(response.content[0].text, /9\.185\.0.*Reinstall dependencies/);
    }
    const absentKeyword = await client.callTool({ name: 'search_components', arguments: { query: 'spinner' } });
    assert.doesNotMatch(absentKeyword.content.map(item => item.text).join('\n'), /\*\*DtLoader\*\*/);
    const resource = await client.readResource({ uri: 'dialtone://components' });
    assert.deepEqual(JSON.parse(resource.contents[0].text).map(record => record.displayName), ['DtButton', 'DtToggle']);
    assert.equal(resource._meta.dialtone.source.hash, result.structuredContent.source.domains.components.hash);
  } finally {
    await client?.close();
    await rm(parent, { recursive: true, force: true, maxRetries: 3 });
  }
});
