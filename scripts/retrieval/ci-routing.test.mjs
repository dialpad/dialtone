import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, mkdirSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { parse } from 'yaml';
import { minimatch } from 'minimatch';
const readWorkflow = (file) =>
  parse(
    readFileSync(
      new URL(`../../.github/workflows/${file}`, import.meta.url),
      'utf8',
    ),
  );
const workflow = readWorkflow('unit_tests.yml');
const filters = parse(
  workflow.jobs.changes.steps.find((step) => step.id === 'filter').with.filters,
);
function assertRouted(label, paths, patternLists) {
  for (const path of paths)
    for (const patterns of patternLists)
      assert.ok(
        patterns.some((pattern) => minimatch(path, pattern)),
        `${label} CI does not run for ${path}`,
      );
}
test('lookup source, data, adapter and harness changes route to the mandatory suites on PRs and staging', () => {
  const paths = [
    'packages/combinator/src/variants/variants_button.js',
    'packages/combinator/src/lib/code_copy.js',
    'packages/combinator/scripts/generate-preset-examples.mjs',
    'nx.json',
    'package.json',
    'pnpm-lock.yaml',
    'packages/dialtone-vue/components/button/button.vue',
    'packages/dialtone-css/lib/build/less/utilities/padding.less',
    'packages/dialtone-tokens/tokens/global.json',
    'packages/dialtone-icons/src/keywords-icons.json',
    'packages/dialtone-docs/src/content/workflows/workflow-ci-pipeline.md',
    'packages/dialtone-docs/src/generators/build-public-docs.mjs',
    'apps/dialtone-documentation/docs/components/tooltip.md',
    'apps/dialtone-documentation/package.json',
    'apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js',
    'scripts/retrieval/profiles.mjs',
    'scripts/build-dialtone-vue-docs.mjs',
    'scripts/lib/vue-component-identity.mjs',
    'lookup-release.config.cjs',
    'scripts/tests/vue-component-identity.test.mjs',
    'common/utils/server.mjs',
    'packages/dialtone-query-core/src/data.ts',
    'packages/dialtone-cli/src/context.ts',
    'packages/dialtone-mcp-server/client-rules.json',
    'packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js',
    'scripts/retrieval/cases.mjs',
    '.github/workflows/unit_tests.yml',
    '.github/workflows/example-guidance.yml',
    '.github/workflows/dialtone-documentation-tests.yml',
  ];
  assertRouted('lookup', paths, [
    workflow.on.pull_request.paths,
    workflow.on.push.paths,
    filters.cli,
  ]);
  const docsWorkflow = readWorkflow('dialtone-documentation-tests.yml');
  assertRouted(
    'documentation',
    [
      'apps/dialtone-documentation/scripts/lib/transform-vue-api.test.mjs',
      'scripts/build-dialtone-vue-docs.mjs',
      'scripts/lib/vue-component-identity.mjs',
      'scripts/tests/vue-component-identity.test.mjs',
      'scripts/retrieval/profiles.mjs',
      'common/utils/server.mjs',
      '.github/workflows/dialtone-documentation-tests.yml',
    ],
    [docsWorkflow.on.pull_request.paths, docsWorkflow.on.push.paths],
  );
  const commands = workflow.jobs['test-cli'].steps
    .map((step) => step.run ?? '')
    .join('\n');
  for (const required of [
    'dialtone-query-core',
    'dialtone-cli',
    'dialtone-mcp-server',
    'dialtone-docs',
    'eslint-plugin-dialtone',
    'scripts/retrieval/run.mjs',
    'scripts/tests/vue-component-identity.test.mjs',
    'scripts/retrieval/*.test.mjs',
    'dialtone-mcp-server:test-startup',
    'test:release-paths',
    'run-acceptance-scenarios.mjs',
  ])
    assert.ok(
      commands.includes(required),
      `missing mandatory suite ${required}`,
    );
});


async function resolveGuidanceSource(eventName = 'workflow_run', sourceHead, bootstrapHead, pilot) {
  const guidance = readWorkflow('example-guidance.yml');
  const script = guidance.jobs.generate.steps.find(step => step.id === 'source').with.script;
  const head = 'a'.repeat(40);
  const outputs = new Map();
  const github = { rest: {
    actions: { getWorkflowRun: async () => ({ data: {
      conclusion: 'success', event: 'pull_request', path: '.github/workflows/unit_tests.yml', head_sha: head, run_attempt: 2,
    } }), listWorkflowRunArtifacts: () => {} },
    repos: { listPullRequestsAssociatedWithCommit: async () => ({ data: [
      { state: 'open', base: { repo: { full_name: 'dialpad/dialtone' } }, head: { sha: head }, number: 1504 },
    ] }) },
  }, paginate: async () => [
    { name: 'example-guidance-inputs-1', expired: false },
    { name: 'example-guidance-inputs-2', expired: true },
    { name: 'example-guidance-inputs-3', expired: false },
    { name: 'unrelated', expired: false },
  ] };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  await new AsyncFunction('github', 'context', 'core', 'process', script)(github,
    { eventName, runId: 12, sha: eventName === 'push' ? head : 'd'.repeat(40), payload: eventName === 'workflow_run' ? { workflow_run: { id: 12 } } : {}, repo: { owner: 'dialpad', repo: 'dialtone' } },
    { setOutput: (key, value) => outputs.set(key, value), notice: () => {} },
    { env: { TOOLING_REF: head, SOURCE_RUN: '12', SOURCE_HEAD: sourceHead, BOOTSTRAP_HEAD: bootstrapHead, PILOT: pilot, CURRENT_ATTEMPT: '2', GITHUB_REPOSITORY: 'dialpad/dialtone' } });
  return outputs;
}

test('guidance reuses the latest available source artifact after a partial Unit Tests rerun', async () => {
  const outputs = await resolveGuidanceSource();
  assert.equal(outputs.get('enabled'), 'true');
  assert.equal(outputs.get('attempt'), '1');
});


test('manual guidance dispatch requires the exact source head used for its spending and concurrency identity', async () => {
  for (const sourceHead of [undefined, '', 'b'.repeat(40)]) {
    await assert.rejects(resolveGuidanceSource('workflow_dispatch', sourceHead), /Source head mismatch/);
  }
  const outputs = await resolveGuidanceSource('workflow_dispatch', 'a'.repeat(40));
  assert.equal(outputs.get('enabled'), 'true');
  assert.equal(outputs.get('head'), 'a'.repeat(40));
});

test('push guidance requires its separately authorized bootstrap head', async () => {
  for (const bootstrapHead of [undefined, '', 'b'.repeat(40)]) {
    const outputs = await resolveGuidanceSource('push', undefined, bootstrapHead);
    assert.equal(outputs.get('enabled'), 'false');
  }
  const outputs = await resolveGuidanceSource('push', undefined, 'a'.repeat(40));
  assert.equal(outputs.get('enabled'), 'true');
  assert.equal(outputs.get('budget'), '15');
  assert.equal(outputs.get('limit'), '500');
});

test('guidance summary preserves visible model text without Markdown formatting or hidden controls', () => {
  const directory = mkdtempSync(join(tmpdir(), 'guidance-summary-'));
  try {
    writeFileSync(join(directory, 'example-guidance.json'), JSON.stringify({ entries: [{
      id: 'examples/test', status: 'complete', notes: [{
        text: '[review](https://example.invalid) **approved** <details>hidden</details>\u202e\ufe0f\u3164',
      }, { text: '# Reviewed' }],
    }], usage: { requests: 0 } }));
    const command = readWorkflow('example-guidance.yml').jobs.generate.steps.find(step => step.name === 'Summarize reviewable notes and usage').run;
    const source = command.match(/<<'JS'.*\n([\s\S]*?)\nJS/)[1];
    const output = spawnSync(process.execPath, ['--input-type=module', '-e', source], { cwd: directory, encoding: 'utf8' });
    assert.equal(output.status, 0, output.stderr);
    const require = createRequire(new URL('../../packages/dialtone-docs/package.json', import.meta.url));
    const MarkdownIt = require('markdown-it');
    const rendered = new MarkdownIt({ html: true, linkify: true }).render(output.stdout);
    assert.ok(!/<a\b[^>]*>review<\/a>/.test(rendered));
    assert.ok(!rendered.includes('<h1>'));
    assert.ok(!rendered.includes('<strong>'));
    assert.ok(!rendered.includes('<details>'));
    assert.ok(rendered.includes('https://example.invalid'));
    for (const character of ['\u202e', '\ufe0f', '\u3164']) assert.ok(!output.stdout.includes(character));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});


test('guidance serializes repository spending while preserving per-head recovery identity', async () => {
  const guidance = readWorkflow('example-guidance.yml');
  const expression = guidance['run-name'].slice('Example guidance '.length);
  assert.equal(guidance.concurrency.group, 'example-guidance-${{ github.repository }}');
  assert.ok(guidance.jobs.generate.steps.find(step => step.env?.ANTHROPIC_API_KEY).run.includes('--monthly-spent-usd'));
  assert.ok(guidance.jobs.generate.steps.find(step => step.env?.ANTHROPIC_API_KEY).run.includes('--month'));
  assert.ok(expression.includes('inputs.source_head'));
  const { trustedGuidanceRun, guidanceSpend, restoreActionGuidance } =
    await import('../../packages/dialtone-docs/scripts/restore-example-guidance.mjs');
  const head = 'a'.repeat(40);
  const run = { id: 12, run_attempt: 1, conclusion: 'success', event: 'push', head_sha: head,
    path: '.github/workflows/example-guidance.yml',
    display_title: guidance['run-name'].replace(/\$\{\{[^}]+\}\}/, head),
    repository: { full_name: 'dialpad/dialtone' }, head_repository: { full_name: 'dialpad/dialtone' } };
  assert.equal(trustedGuidanceRun(run, { runId: '12', runAttempt: 1, head, toolingRef: head },
    'dialpad/dialtone', { toolingTrusted: true }), true);
  assert.equal(guidanceSpend(run, undefined, head), 1);
  const paid = Object.entries(guidance.jobs).flatMap(([job, config]) => config.steps
    .filter(step => step.env?.ANTHROPIC_API_KEY).map(step => ({ job: config.name ?? job, step: step.name })));
  assert.equal(paid.length, 1);
  for (const jobName of new Set(['generate', paid[0].job])) {
    for (const [conclusion, expectedSpend] of [['skipped', 0], ['failure', 1]]) {
      const restored = restoreActionGuidance('dialpad/dialtone', { generation: true, sourceHead: head,
        currentRun: '99', toolingRef: head, readArtifact: () => undefined,
        request: endpoint => endpoint.includes('/jobs?') ? { total_count: 1, jobs: [{ name: jobName,
          steps: [{ name: paid[0].step, conclusion, started_at: '2026-11-01T00:00:00Z' }],
        }] } : { total_count: 1, workflow_runs: [run] },
      });
      assert.equal(restored.spentUsd, expectedSpend);
    }
  }
});

test('the comparison pilot requires an exact approved push head and 21 unique IDs with a combined one-dollar cap', async () => {
  const ids = Array.from({ length: 21 }, (_, index) => `examples/${index}`);
  const approved = JSON.stringify({ head: 'a'.repeat(40), ids });
  const outputs = await resolveGuidanceSource('push', undefined, undefined, approved);
  assert.equal(outputs.get('enabled'), 'true');
  assert.equal(outputs.get('pilot'), ids.join(','));
  assert.equal(outputs.get('budget'), '1');
  assert.equal(outputs.get('limit'), '84');
  const sonnet = await resolveGuidanceSource('push', undefined, undefined, JSON.stringify({ head: 'a'.repeat(40), ids, model: 'claude-sonnet-5-5' }));
  assert.equal(sonnet.get('pilot-model'), 'claude-sonnet-5-5');
  assert.equal(sonnet.get('limit'), '42');
  for (const event of ['workflow_run', 'workflow_dispatch']) {
    const ordinary = await resolveGuidanceSource(event, 'a'.repeat(40), 'a'.repeat(40));
    assert.equal(ordinary.get('budget'), '1');
    assert.equal(ordinary.get('limit'), '20');
  }
  const wrongHead = await resolveGuidanceSource('push', undefined, undefined,
    JSON.stringify({ head: 'b'.repeat(40), ids }));
  assert.equal(wrongHead.get('enabled'), 'false');
  for (const pilot of [JSON.stringify({ head: 'a'.repeat(40), ids: ids.slice(1) }),
    JSON.stringify({ head: 'a'.repeat(40), ids, model: 'unapproved' })]) {
    for (const bootstrap of [undefined, 'a'.repeat(40)]) {
      await assert.rejects(resolveGuidanceSource('push', undefined, bootstrap, pilot), /invalid.*pilot|pilot.*invalid/i);
    }
  }
});


test('the paid workflow step carries restored request usage through the real driver CLI', async () => {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'guidance-request-cap-')));
  try {
    const docs = join(directory, 'packages/dialtone-docs');
    for (const path of ['scripts', 'src/generators', 'dist', '.generated/example-guidance']) mkdirSync(join(docs, path), { recursive: true });
    const driver = readFileSync(new URL('../../packages/dialtone-docs/scripts/generate-example-guidance.mjs', import.meta.url), 'utf8');
    writeFileSync(join(docs, 'scripts/generate-example-guidance.mjs'), driver);
    writeFileSync(join(docs, 'src/generators/example-guidance.mjs'), readFileSync(new URL('../../packages/dialtone-docs/src/generators/example-guidance.mjs', import.meta.url)));
    const { createGuidanceManifest, guidanceHash, guidanceMonth, GUIDANCE_MODEL } = await import('../../packages/dialtone-docs/src/generators/example-guidance.mjs');
    const manifest = createGuidanceManifest([{ id: 'examples/request-cap', sources: [{ id: 'source', text: 'Save' }], dependencies: [] }],
      { model: GUIDANCE_MODEL, toolingHash: 'a'.repeat(64), driverHash: guidanceHash(driver) });
    writeFileSync(join(docs, 'dist/example-guidance-inputs.json'), JSON.stringify(manifest));
    writeFileSync(join(docs, '.generated/example-guidance/reviewed.json'), JSON.stringify({ schemaVersion: 1, entries: [] }));
    writeFileSync(join(docs, '.generated/example-guidance/previous-spend.json'), JSON.stringify({ spentUsd: 0, spentRequests: 2, monthlySpentUsd: 0, month: guidanceMonth() }));
    const step = readWorkflow('example-guidance.yml').jobs.generate.steps.find(step => step.env?.ANTHROPIC_API_KEY);
    const env = { ...process.env, REQUEST_LIMIT: '2', BUDGET_USD: '1' };
    for (const key of ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GH_TOKEN', 'GITHUB_TOKEN', 'NODE_AUTH_TOKEN']) delete env[key];
    for (const model of ['', GUIDANCE_MODEL]) {
      const run = spawnSync('bash', ['-e', '-c', step.run], { cwd: directory,
        env: { ...env, PILOT_IDS: model ? manifest.entries[0].id : '', PILOT_MODEL: model }, encoding: 'utf8' });
      assert.equal(run.status, 1, run.stderr);
      const output = JSON.parse(readFileSync(join(directory, 'example-guidance.json')));
      assert.equal(output.usage.requests, 0);
      if (model) {
        assert.equal(output.pilot.length, 1);
        assert.equal(output.pilot[0].model, GUIDANCE_MODEL);
        assert.equal(output.pilot[0].entries[0].status, 'pending');
        assert.deepEqual(output.entries, []);
      } else assert.equal(output.entries[0].status, 'pending');
    }
    const rejected = join(directory, 'rejected.json');
    const blank = spawnSync('node', [join(docs, 'scripts/generate-example-guidance.mjs'),
      join(docs, 'dist/example-guidance-inputs.json'), rejected,
      '--pilot-ids', manifest.entries[0].id, '--pilot-model', '',
      '--monthly-spent-usd', '0', '--month', guidanceMonth()], { env, encoding: 'utf8' });
    assert.equal(blank.status, 1);
    assert.match(blank.stderr, /Invalid pilot/i);
    assert.throws(() => readFileSync(rejected), { code: 'ENOENT' });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
