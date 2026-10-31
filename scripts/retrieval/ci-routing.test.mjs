import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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


test('guidance reuses the latest available source artifact after a partial Unit Tests rerun', async () => {
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
    { eventName: 'workflow_run', payload: { workflow_run: { id: 12 } }, repo: { owner: 'dialpad', repo: 'dialtone' } },
    { setOutput: (key, value) => outputs.set(key, value), notice: () => {} },
    { env: { TOOLING_REF: head, GITHUB_REPOSITORY: 'dialpad/dialtone' } });
  assert.equal(outputs.get('enabled'), 'true');
  assert.equal(outputs.get('attempt'), '1');
});
