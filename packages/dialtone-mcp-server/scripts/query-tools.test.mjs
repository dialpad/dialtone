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
    const tools = (await client.listTools()).tools;
    for (const name of ['get_component', 'get_documentation'])
      assert.ok(tools.find((tool) => tool.name === name).outputSchema);
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
function readable(result) {
  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent, undefined);
  assert.ok(result.content.every((item) => item.type === 'text'));
  return result.content.map((item) => item.text).join('\n');
}
function pageSubjects(text, name, recordPattern) {
  return name === 'search_documentation'
    ? [...text.matchAll(/get_documentation\((\{[^`\n]+\})\)/g)].map(
        (match) => JSON.parse(match[1]).id,
      )
    : [...text.matchAll(recordPattern)].map((match) => match[1]);
}
function nextCall(text) {
  const match = text.match(/\*\*Continue:\*\* `([^(`]+)\(([^\n]+)\)`/);
  return match ? { name: match[1], arguments: JSON.parse(match[2]) } : null;
}
test('readable searches execute default 15, explicit limits and compatible inputs with progressing pages', async () =>
  fixture(async (client) => {
    for (const [name, query, recordPattern] of [
      ['search_utility_classes', 'padding', /^\d+\. \*\*([^*]+)\*\*/gm],
      ['search_tokens', 'color', /^\d+\. \*\*([^*]+)\*\*/gm],
      ['search_components', 'button', /^\d+\. \*\*([^*]+)\*\*/gm],
      ['search_icons', 'arrow', /^ {2}• \*\*([^*]+)\*\*/gm],
      ['search_documentation', 'accessibility', /^### /gm],
    ]) {
      const tool = (await client.listTools()).tools.find(
        (tool) => tool.name === name,
      );
      assert.equal(tool.inputSchema.properties.limit.type, 'number');
      assert.equal(tool.inputSchema.properties.limit.default, 15);
      assert.equal(tool.inputSchema.properties.query.maxLength, undefined);
      assert.notEqual(tool.inputSchema.additionalProperties, false);
      for (const [arguments_, count] of [
        [{ query }, 15],
        [{ query, limit: 2.5, unused: 'accepted' }, 2],
        [{ query, limit: '2' }, 2],
      ]) {
        const text = readable(
          await client.callTool({ name, arguments: arguments_ }),
        );
        assert.equal([...text.matchAll(recordPattern)].length, count, name);
        const next = nextCall(text);
        assert.ok(next, name);
        assert.equal(next.arguments.offset, count);
        const following = readable(await client.callTool(next));
        assert.ok(following.includes(`offset ${count}.`));
        const firstSubjects = pageSubjects(text, name, recordPattern);
        const nextSubjects = pageSubjects(following, name, recordPattern);
        assert.ok(nextSubjects.length > 0);
        assert.ok(
          nextSubjects.every((subject) => !firstSubjects.includes(subject)),
        );
      }
      const negative = readable(
        await client.callTool({ name, arguments: { query, limit: -1 } }),
      );
      assert.ok([...negative.matchAll(recordPattern)].length > 0);
      assert.equal(nextCall(negative), null);
      const larger = readable(
        await client.callTool({ name, arguments: { query, limit: 40 } }),
      );
      assert.ok([...larger.matchAll(recordPattern)].length > 15, name);
      const blank = readable(
        await client.callTool({ name, arguments: { query: '   ' } }),
      );
      assert.match(blank, /no (?:match|.*found)/i);
      const long = readable(
        await client.callTool({ name, arguments: { query: 'x'.repeat(257) } }),
      );
      assert.match(long, /no (?:match|.*found)/i);
      assert.equal(
        (await client.callTool({ name, arguments: { query, offset: -1 } }))
          .isError,
        true,
      );
    }
  }));
test('selected component detail pagination makes progress and missing selectors are actionable', async () =>
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
test('all five searches retain readable domain facts, notes and provenance without structured output', async () =>
  fixture(async (client) => {
    const core = await import('@dialpad/dialtone-query-core');
    for (const [name, query, domain] of [
      ['search_utility_classes', 'd-chip__close', 'utilityClasses'],
      ['search_tokens', '--dt-color-foreground-primary', 'tokens'],
      ['search_components', 'DtButton', 'components'],
      ['search_icons', 'voicemail', 'icons'],
      ['search_documentation', 'checkbox accessibility', 'documentation'],
    ]) {
      const tool = (await client.listTools()).tools.find(
        (tool) => tool.name === name,
      );
      assert.equal(tool.outputSchema, undefined, name);
      const text = readable(
        await client.callTool({ name, arguments: { query } }),
      );
      const stamp = core.bundledProvenance.domains[domain];
      for (const fact of [
        stamp.package,
        stamp.version,
        stamp.hash,
        'bundled',
        'installed compatibility not checked',
      ])
        assert.ok(text.includes(fact), `${name}: ${fact}`);
      if (domain === 'utilityClasses') {
        assert.ok(core.utilityClasses[query].values.length > 2);
        for (const record of core.utilityClasses[query].values) {
          assert.ok(text.includes(`${record.prop}: ${record.value}`));
          if (record.description) assert.ok(text.includes(record.description));
        }
        assert.ok(text.includes('class="d-chip__close"'));
      } else if (domain === 'tokens') {
        const themes = Object.entries(core.tokens[query]).filter(
          ([theme]) => theme !== 'metadata',
        );
        for (const [theme, contract] of themes.slice(0, 3))
          assert.ok(text.includes(`${theme}: ${contract.value}`));
        assert.ok(text.includes('Usage:'));
        assert.ok(text.includes('projection'));
        assert.ok(text.includes('themes'));
        assert.match(text, /sample|preview/i);
      } else if (domain === 'components') {
        const record = core.components.find(
          (component) => component.displayName === 'DtButton',
        );
        for (const prop of record.props.slice(0, 5)) {
          assert.ok(
            text.includes(`\`${prop.name}\` (${prop.type?.name || 'unknown'})`),
          );
          if (prop.description) assert.ok(text.includes(prop.description));
          for (const value of prop.values?.slice(0, 3) ?? [])
            assert.ok(text.includes(value));
        }
        for (const section of ['events', 'slots'])
          for (const record_ of record[section]?.slice(0, 3) ?? [])
            assert.ok(text.includes(record_.name));
        assert.ok(
          text.includes(`import { DtButton } from '@dialpad/dialtone-vue'`),
        );
        assert.ok(text.includes('get_component'));
        assert.match(text, /sample|preview/i);
      } else if (domain === 'icons') {
        assert.ok(text.includes('**voicemail**'));
        assert.ok(text.includes('DtIconVoicemail'));
        assert.ok(text.includes(`from '@dialpad/dialtone-icons/vue'`));
      } else {
        assert.ok(text.includes('Checkbox'));
        assert.ok(text.includes('get_documentation'));
        assert.ok(text.includes('components/checkbox#'));
      }
    }
    const notes = readable(
      await client.callTool({
        name: 'search_components',
        arguments: { query: 'ariaLabel' },
      }),
    );
    assert.match(notes, /No component named/);
  }));
test('readable exact token themes retrieve all source records and migration metadata', async () =>
  fixture(async (client) => {
    const { tokens } = await import('@dialpad/dialtone-query-core');
    const query = '--dt-color-foreground-primary';
    const expected = Object.entries(tokens[query]).filter(
      ([name]) => name !== 'metadata',
    );
    assert.ok(expected.length > 17, 'fixture must span multiple pages');
    const seen = [];
    let call = {
      name: 'search_tokens',
      arguments: { query, projection: 'themes', limit: 17 },
    };
    for (let page = 0; page < 10; page++) {
      const text = readable(await client.callTool(call));
      const records = [...text.matchAll(/^\d+\. \*\*([^*]+)\*\*/gm)];
      const themes = records.map((match) => match[1]);
      assert.ok(themes.length > 0);
      for (const [index, record] of records.entries()) {
        const block = text.slice(record.index, records[index + 1]?.index);
        const contract = tokens[query][record[1]];
        for (const [field, value] of Object.entries(contract))
          assert.ok(
            block.includes(
              `${field}: ${typeof value === 'string' ? value : JSON.stringify(value)}`,
            ),
          );
      }
      seen.push(...themes);
      const next = nextCall(text);
      if (!next) break;
      assert.ok(next.arguments.offset > (call.arguments.offset ?? 0));
      call = next;
    }
    assert.deepEqual(
      seen,
      expected.map(([theme]) => theme),
    );
    const deprecated = '--dt-font-size-root';
    const text = readable(
      await client.callTool({
        name: 'search_tokens',
        arguments: { query: deprecated, projection: 'themes' },
      }),
    );
    for (const [field, value] of Object.entries(tokens[deprecated].metadata))
      assert.ok(
        text.includes(
          `${field}: ${typeof value === 'string' ? value : JSON.stringify(value)}`,
        ),
      );
    for (const query_ of [
      'color foreground primary',
      'definitely-missing',
      'constructor',
    ]) {
      const missing = readable(
        await client.callTool({
          name: 'search_tokens',
          arguments: { query: query_, projection: 'themes' },
        }),
      );
      assert.match(missing, /No exact/);
      assert.ok(missing.includes('search_tokens'));
    }
  }));
test('selected detail tools retain strict schemas and budgets', async () =>
  fixture(async (client) => {
    for (const [name, arguments_] of [
      ['get_component', { component: 'DtButton', limit: 1.5 }],
      ['get_component', { component: 'DtButton', ignored: true }],
      [
        'get_documentation',
        { id: 'components/checkbox#accessibility', textLimit: 0 },
      ],
      ['get_documentation', { id: ' ', ignored: true }],
    ]) {
      const result = await client.callTool({ name, arguments: arguments_ });
      assert.equal(result.isError, true);
    }
    const detail = structured(
      await client.callTool({
        name: 'get_component',
        arguments: {
          component: 'DtButton',
          projection: 'props',
          field: 'kind',
        },
      }),
    );
    assert.ok(
      detail.budget.estimatedTokens <= detail.budget.maximumEstimatedTokens,
    );
  }));
