// One delivery probe against installed packed CLI/MCP candidates.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { sha256 } from './fixtures.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(resolve(root, 'packages/dialtone-mcp-server/package.json'));
const { Client } = await import(require.resolve('@modelcontextprotocol/sdk/client/index.js'));
const { StdioClientTransport } = await import(require.resolve('@modelcontextprotocol/sdk/client/stdio.js'));
const installed = resolve(process.argv[2]);
const cli = resolve(installed, 'node_modules/@dialpad/dialtone-cli/build/index.js');
const server = resolve(installed, 'node_modules/@dialpad/dialtone-mcp-server/build/index.js');
const offline = resolve(root, 'scripts/retrieval/offline-registry.mjs');
const run = args => execFileSync(process.execPath, ['--import', offline, cli, '--bundled', ...args], { cwd: installed, encoding: 'utf8', timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] });
const documentationBytes = readFileSync(resolve(root, 'packages/dialtone-docs/dist/public-docs.json'));
const expected = JSON.parse(documentationBytes).filter(record => record.example);
const client = new Client({ name: 'packed-example-delivery', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: ['--import', offline, server], cwd: installed, stderr: 'pipe' }));
const results = [];
try {
  for (const record of expected) {
    assert.deepEqual(JSON.parse(run(['docs', '--id', record.id, '--format', 'json'])), [record]);
    assert.equal(run(['docs', '--id', record.id]).trim(), record.content.trim());
    let args = { id: record.id, textLimit: 701 };
    let content = '';
    let pages = 0;
    do {
      const response = await client.callTool({ name: 'get_documentation', arguments: args });
      assert.ok(!response.isError);
      const envelope = response.structuredContent;
      assert.equal(envelope.match, 'exact');
      assert.equal(envelope.source.installedCompatibility, 'not_checked');
      assert.equal(envelope.source.domains.documentation.hash, sha256(documentationBytes));
      assert.deepEqual(envelope.items[0].example, record.example);
      content += envelope.items[0].content;
      pages++;
      args = envelope.continuation?.arguments;
      if (args) assert.equal(args.textOffset, Array.from(content).length);
    } while (args);
    assert.equal(content, record.content);
    results.push({
      id: record.id, payloadHash: record.example.validation.payloadHash, pages, characters: Array.from(content).length,
    });
  }
  for (const id of ['examples/unknown', 'examples/presets/DtModal/default', 'examples/presets/DtButton/block%20start%20icon']) {
    assert.throws(() => run(['docs', '--id', id]), /No documentation found/);
    assert.equal((await client.callTool({ name: 'get_documentation', arguments: { id } })).structuredContent.match, 'no-match');
  }
  const missing = await client.callTool({ name: 'get_documentation', arguments: { id: 'examples/unknown' } });
  assert.equal(missing.structuredContent.match, 'no-match');
  const recoveryIds = missing.structuredContent.notes.flatMap(note =>
    note.match(/examples\/\S+?(?=, |\.(?:\s|$)|$)/g) ?? []);
  assert.ok(recoveryIds.length > 0 && recoveryIds.length <= 3);
  for (const id of recoveryIds) assert.ok(expected.some(record => record.id === id));
  assert.equal(missing.structuredContent.continuation.tool, 'search_documentation');
  const legacy = JSON.parse(run(['component', 'DtButton', '--examples', '--format', 'json']));
  assert.equal(legacy.name, 'DtButton');
  assert.ok(!legacy.examples);
  const tools = (await client.listTools()).tools;
  const searchTools = tools.filter(tool => tool.name.startsWith('search_'));
  assert.equal(searchTools.length, 5, searchTools.map(tool => tool.name).join(', '));
  for (const tool of searchTools) {
    assert.equal(tool.outputSchema, undefined);
    const response = await client.callTool({ name: tool.name, arguments: { query: 'button', limit: 1 } });
    assert.equal(response.structuredContent, undefined);
    assert.ok(response.content.every(content => content.type === 'text'));
  }
  const search = await client.callTool({ name: 'search_components', arguments: { query: 'DtButton' } });
  assert.match(search.content[0].text, /examples\/button-default/);
  assert.match(run(['utility', 'd-ww-normal']), /examples\/utility-word-wrap-normal/);
  const utility = await client.callTool({ name: 'search_utility_classes', arguments: { query: 'd-ww-normal' } });
  assert.match(utility.content[0].text, /examples\/utility-word-wrap-normal/);
  for (const query of ['stack', 'link']) {
    const unrelated = await client.callTool({ name: 'search_components', arguments: { query } });
    assert.doesNotMatch(unrelated.content[0].text, /examples\/button-/);
  }
  for (const name of ['search_components', 'search_documentation']) {
    const contextual = await client.callTool({ name, arguments: { query: 'I need a complete working Vue 3 example of a disabled Dialtone button that shows a tooltip on hover' } });
    assert.match(contextual.content[0].text, /examples\/button-disabled-tooltip/);
  }
  assert.doesNotMatch(run(['component', 'DtStack', '--examples']), /examples\/button-/);
  assert.match(run(['docs', 'button with a tooltip']), /examples\/button-disabled-tooltip/);
} finally {
  await client.close();
}
const report = { installed, results, negatives: 'passed', legacyExamplesJson: 'preserved', fiveSearchTools: 'text-only' };
writeFileSync(resolve(installed, 'packed-example-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
