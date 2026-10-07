import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { cases, expectedFailures } from './cases.mjs';
import { evaluateAssertions } from './assertions.mjs';
import { sha256 } from './fixtures.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const reportArgument = process.argv.indexOf('--report');
const reportPath =
  reportArgument >= 0 ? process.argv[reportArgument + 1] : null;
if (reportArgument >= 0 && !reportPath?.trim())
  throw new Error('--report requires a non-empty output path');
const offline = fileURLToPath(new URL('offline-registry.mjs', import.meta.url));
const execute = promisify(execFile);
const domains = {
  components: [
    'searchComponents',
    'components',
    'formatComponentResults',
    'search_components',
    'component',
  ],
  utilities: [
    'searchUtilityClasses',
    'utilityClasses',
    'formatResults',
    'search_utility_classes',
    'utility-class',
  ],
  tokens: [
    'searchTokens',
    'tokens',
    'formatTokenResults',
    'search_tokens',
    'design-token',
  ],
  icons: ['searchIcons', 'icons', 'formatIconResults', 'search_icons', 'icon'],
  documentation: [
    'searchDocumentation',
    'documentation',
    'formatDocumentationResults',
    'search_documentation',
    'documentation',
  ],
};
const core = await import(
  new URL('../../packages/dialtone-query-core/build/index.js', import.meta.url)
);
const require = createRequire(
  new URL('../../packages/dialtone-mcp-server/package.json', import.meta.url),
);
const { Client } = await import(
  pathToFileURL(require.resolve('@modelcontextprotocol/sdk/client/index.js'))
);
const { StdioClientTransport } = await import(
  pathToFileURL(require.resolve('@modelcontextprotocol/sdk/client/stdio.js'))
);
const client = new Client({
  name: 'dialtone-retrieval-regressions',
  version: '1.0.0',
});
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [
    '--import',
    offline,
    resolve(root, 'packages/dialtone-mcp-server/build/index.js'),
  ],
  cwd: root,
  stderr: 'pipe',
});
transport.stderr?.on('data', () => {});

function textNames(text, domain) {
  if (domain === 'documentation')
    return [...text.matchAll(/^### (.+)$/gm)].map((match) =>
      match[1].replace(' — ', ' > '),
    );
  const expression =
    domain === 'icons' ? /• \*\*(.+?)\*\*/g : /^\d+\. \*\*(.+?)\*\*/gm;
  return [...text.matchAll(expression)].map((match) => match[1]);
}
async function query(testCase, adapter) {
  const [search, data, format, tool, type] = domains[testCase.domain];
  if (adapter === 'core') {
    // Size values are sampled from standalone-vue3-legacy 3.157.0 metadata.
    // This small old-schema fixture establishes lookup facts, with no installation/build claim.
    const dataset =
      testCase.fixture === 'legacy'
        ? [
            {
              displayName: 'DtButton',
              props: [
                {
                  name: 'size',
                  values: ['xs', 'sm', 'md', 'lg', 'xl'],
                  type: { name: 'string' },
                },
              ],
            },
          ]
        : core[data];
    // Query-core debug logging is unrelated to deterministic retrieval evidence.
    const stderr = console.error;
    let result;
    try {
      console.error = () => {};
      result = core[search](testCase.query, dataset);
    } finally {
      console.error = stderr;
    }
    const limited = result.results.slice(0, testCase.limit);
    return {
      names: limited.map((value) => value.name),
      text: `${JSON.stringify(limited)}\n${core[format](limited, testCase.query)}`,
    };
  }
  if (adapter === 'cli') {
    const command =
      testCase.domain === 'documentation'
        ? 'docs'
        : testCase.domain === 'utilities'
          ? 'utility'
          : 'search';
    let stdout, stderr;
    try {
      ({ stdout, stderr } = await execute(
        process.execPath,
        [
          '--import',
          offline,
          resolve(root, 'packages/dialtone-cli/build/index.js'),
          command,
          '--bundled',
          '--format',
          'json',
          '--limit',
          testCase.domain === 'icons' ? '20' : String(testCase.limit),
          '--',
          testCase.query,
        ],
        { cwd: root, timeout: 10000, maxBuffer: 512 * 1024 },
      ));
    } catch (error) {
      // Only the adapter's documented negative result (exit 1 + precise diagnostic) is accepted.
      const negative =
        testCase.domain === 'documentation'
          ? `No documentation found matching "${testCase.query}".`
          : `No utility classes found matching "${testCase.query}".`;
      if (
        error.code !== 1 ||
        error.killed ||
        error.stdout.trim() ||
        !error.stderr.includes(negative)
      )
        throw error;
      return { names: [], text: error.stderr };
    }
    assert.ok(
      stderr.includes('Using bundled Dialtone data'),
      'CLI source selection must be explicit',
    );
    const parsed = JSON.parse(stdout);
    const results =
      command === 'search'
        ? parsed.filter((value) => value.type === type).slice(0, testCase.limit)
        : parsed;
    return {
      names: results.map(
        (value) =>
          value.name ??
          value.docTitle +
            (value.headingPath.length
              ? ' > ' + value.headingPath.join(' > ')
              : ''),
      ),
      text: JSON.stringify(results),
      bytes: Buffer.byteLength(stdout),
    };
  }
  const response = await client.callTool(
    { name: tool, arguments: { query: testCase.query, limit: testCase.limit } },
    undefined,
    { timeout: 10000 },
  );
  assert.notEqual(
    response.isError,
    true,
    `MCP tool error: ${JSON.stringify(response)}`,
  );
  assert.ok(
    Array.isArray(response.content) &&
      response.content.every((value) => value.type === 'text'),
    'Expected MCP text content',
  );
  const text = response.content.map((value) => value.text).join('\n');
  return {
    names: textNames(text, testCase.domain),
    text: testCase.wire ? JSON.stringify(response) : text,
    bytes: Buffer.byteLength(JSON.stringify(response)),
  };
}

const report = {
  contractVersion: 1,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim(),
  node: process.version,
  sourceDiffSha256: sha256(execFileSync('git', ['diff'], { cwd: root })),
  registryCheck: 'disabled for deterministic retrieval',
  artifacts: [],
  results: [],
};
try {
  await client.connect(transport, { timeout: 10000 });
  const rules = await client.readResource(
    { uri: 'dialtone://client-rules' },
    { timeout: 10000 },
  );
  assert.deepEqual(
    JSON.parse(rules.contents[0].text),
    JSON.parse(
      await readFile(
        resolve(root, 'packages/dialtone-mcp-server/client-rules.json'),
        'utf8',
      ),
    ),
    'MCP bundled client rules are fresh',
  );
  for (const path of [
    'scripts/build-dialtone-vue-docs.mjs',
    'scripts/retrieval/cases.mjs',
    'scripts/retrieval/run.mjs',
    'scripts/retrieval/profiles.mjs',
    '.github/workflows/unit_tests.yml',
    'packages/dialtone-query-core/package.json',
    'packages/dialtone-cli/package.json',
    'packages/dialtone-mcp-server/package.json',
    'packages/dialtone-vue/dist/component-documentation.json',
    'packages/dialtone-css/lib/dist/dialtone-docs.json',
    'packages/dialtone-css/lib/dist/tokens-docs.json',
    'packages/dialtone-icons/src/keywords-icons.json',
    'packages/dialtone-docs/dist/public-docs.json',
    'packages/dialtone-cli/build/index.js',
    'packages/dialtone-mcp-server/build/index.js',
  ]) {
    const bytes = await readFile(resolve(root, path));
    report.artifacts.push({
      path,
      sha256: sha256(bytes),
      bytes: bytes.length,
      ...(path.endsWith('/package.json')
        ? {
            package: JSON.parse(bytes).name,
            version: JSON.parse(bytes).version,
          }
        : {}),
    });
  }
  const failures = [];
  for (const testCase of cases)
    for (const adapter of testCase.adapters) {
      const id = `${testCase.id}/${adapter}`;
      try {
        const actual = await query(testCase, adapter);
        const checks = [
          ...testCase.checks,
          ...(testCase.checksByAdapter?.[adapter] ?? []),
          {
            id: 'output-budget',
            kind: 'bytes',
            value: adapter === 'mcp' ? 16000 : 100000,
          },
        ];
        report.results.push(
          evaluateAssertions(id, actual, checks, expectedFailures[id]),
        );
      } catch (error) {
        failures.push(`${id}: ${error.message}`);
        report.results.push({ id, status: 'fail', message: error.message });
      }
    }
  if (reportPath)
    await writeFile(
      resolve(reportPath),
      JSON.stringify(report, null, 2) + '\n',
    );
  console.log(
    JSON.stringify(
      {
        cases: cases.length,
        results: report.results.length,
        pass: report.results.filter((value) => value.status === 'pass').length,
        expectedFailures: report.results.filter(
          (value) => value.status === 'expected-failure',
        ).length,
        failures,
      },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
} finally {
  await client.close();
}
