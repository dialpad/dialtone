import test from 'node:test';
import assert from 'node:assert/strict';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { components, bundledProvenance } from '@dialpad/dialtone-query-core';
import * as module from '../src/query-tools.ts';
async function fixture(run) {
  const server = new McpServer(
    { name: 'test-dialtone', version: '1.5.0' },
    { instructions: module.ROUTING_INSTRUCTIONS, capabilities: { tools: {} } },
  );
  module.registerQueryTools(server);
  const client = new Client({
    name: 'dialtone-protocol-fixture',
    version: '1.0.0',
  });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  let protocol;
  const send = serverTransport.send.bind(serverTransport);
  serverTransport.send = (message) => {
    if (message.result?.protocolVersion)
      protocol = message.result.protocolVersion;
    return send(message);
  };
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    assert.equal(protocol, '2025-06-18');
    await client.listTools();
    await run(client);
  } finally {
    await client.close();
    await server.close();
  }
}
function structured(result) {
  assert.ok(result.structuredContent, 'Structured output must be delivered');
  const text = result.content.find((item) => item.type === 'text').text;
  assert.deepEqual(
    JSON.parse(text.slice(text.indexOf('\n') + 1)),
    result.structuredContent,
  );
  return result.structuredContent;
}
test('initialization delivers bounded routing instructions and complete selected Button kind', async () =>
  fixture(async (client) => {
    assert.equal(client.getInstructions(), module.ROUTING_INSTRUCTIONS);
    assert.ok(module.ROUTING_INSTRUCTIONS.split(/\s+/).length <= 100);
    for (const route of [
      'get_component',
      'get_documentation',
      'bundled data',
      'installed compatibility is not checked',
    ])
      assert.ok(module.ROUTING_INSTRUCTIONS.slice(0, 512).includes(route));
    const tool = (await client.listTools()).tools.find(
      (tool) => tool.name === 'get_component',
    );
    assert.ok(tool.outputSchema);
    const result = structured(
      await client.callTool({
        name: 'get_component',
        arguments: {
          component: 'DtButton',
          projection: 'props',
          field: 'kind',
        },
      }),
    );
    const button = components.find(
      (component) => component.displayName === 'DtButton',
    );
    assert.equal(result.canonicalIdentity.canonicalName, 'DtButton');
    assert.deepEqual(
      result.items[0].contract,
      button.props.find((prop) => prop.name === 'kind'),
    );
    assert.equal(
      result.source.domains.components.hash,
      bundledProvenance.domains.components.hash,
    );
    assert.equal(result.source.installedCompatibility, 'not_checked');
  }));
test('scoped bindings and event payloads match the generated Combobox data', async () =>
  fixture(async (client) => {
    const record = components.find(
      (component) => component.displayName === 'DtComboboxWithPopover',
    );
    for (const projection of ['events', 'slots']) {
      const result = structured(
        await client.callTool({
          name: 'get_component',
          arguments: { component: record.displayName, projection, limit: 50 },
        }),
      );
      assert.deepEqual(
        result.items.map((item) => item.contract),
        record[projection] ?? [],
      );
    }
  }));
test('all tools reject invalid queries/limits and execute their advertised defaults', async () =>
  fixture(async (client) => {
    for (const tool of (await client.listTools()).tools.filter((tool) =>
      tool.name.startsWith('search_'),
    )) {
      for (const limit of [
        '2',
        -1,
        0,
        1.5,
        tool.inputSchema.properties.limit.maximum + 1,
      ]) {
        const result = await client.callTool({
          name: tool.name,
          arguments: { query: 'button', limit },
        });
        assert.equal(result.isError, true, `${tool.name}:${limit}`);
      }
      assert.equal(
        (
          await client.callTool({
            name: tool.name,
            arguments: { query: '   ' },
          })
        ).isError,
        true,
      );
      const result = structured(
        await client.callTool({
          name: tool.name,
          arguments: { query: 'button' },
        }),
      );
      assert.ok(
        result.counts.returned <= tool.inputSchema.properties.limit.default,
      );
      if (result.continuation)
        assert.equal(
          result.continuation.arguments.limit,
          tool.inputSchema.properties.limit.default,
        );
    }
  }));
test('discovery/detail pagination makes progress and missing selectors are actionable', async () =>
  fixture(async (client) => {
    const first = structured(
      await client.callTool({
        name: 'get_component',
        arguments: { component: 'DtButton', projection: 'props', limit: 1 },
      }),
    );
    assert.equal(first.counts.returned, 1);
    assert.equal(first.continuation.arguments.offset, 1);
    const next = structured(
      await client.callTool({
        name: first.continuation.tool,
        arguments: first.continuation.arguments,
      }),
    );
    assert.notEqual(next.items[0].contract.name, first.items[0].contract.name);
    const missing = structured(
      await client.callTool({
        name: 'get_component',
        arguments: {
          component: 'DtButton',
          projection: 'props',
          field: 'definitely-missing',
        },
      }),
    );
    assert.equal(missing.match, 'no-match');
    assert.ok(missing.detail.available.includes('kind'));
    const absent = structured(
      await client.callTool({
        name: 'get_component',
        arguments: { component: 'DtDefinitelyMissing' },
      }),
    );
    assert.equal(absent.match, 'no-match');
    assert.equal(absent.continuation.tool, 'search_components');
  }));
test('exact documentation retrieval preserves guidance beyond the discovery excerpt', async () =>
  fixture(async (client) => {
    const { documentation } = await import('@dialpad/dialtone-query-core');
    const record = documentation.find(
      (record) =>
        record.docId === 'components/checkbox' &&
        record.content.includes('aria-describedby'),
    );
    assert.ok(record);
    let args = { id: record.id, textLimit: 500 };
    let content = '';
    for (let page = 0; page < 20; page++) {
      const result = structured(
        await client.callTool({ name: 'get_documentation', arguments: args }),
      );
      assert.equal(result.match, 'exact');
      content += result.items[0].content;
      if (!result.continuation) break;
      args = result.continuation.arguments;
    }
    assert.equal(content, record.content);
    assert.ok(content.includes('aria-describedby'));
  }));
test('discovery counts retain documented methods/exposed members and unknown sections', async () =>
  fixture(async (client) => {
    for (const [name, section] of [
      ['DtMotionText', 'methods'],
      ['DtHovercard', 'expose'],
      ['DtScroller', 'expose'],
      ['DtRichTextEditor', 'slots'],
    ]) {
      const record = components.find(
        (component) => component.displayName === name,
      );
      const result = structured(
        await client.callTool({
          name: 'search_components',
          arguments: { query: name },
        }),
      );
      const candidate = result.items.find((item) => item.name === name);
      assert.equal(
        candidate.apiCounts[section],
        record[section]?.length ?? null,
        `${name}.${section}`,
      );
    }
  }));
