import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
assert.equal(
  require('nx/package.json').version,
  '19.8.0',
  'Nx private routing-test dependencies require 19.8.0; inspect their new versions before updating this guard',
);
const nxRequire = createRequire(require.resolve('nx/package.json'));
const { parse } = nxRequire('yaml');
const { minimatch } = nxRequire('minimatch');
const workflow = parse(
  readFileSync(
    new URL('../../.github/workflows/unit_tests.yml', import.meta.url),
    'utf8',
  ),
);
const filters = parse(
  workflow.jobs.changes.steps.find((step) => step.id === 'filter').with.filters,
);
test('lookup source, data, adapter and harness changes route to the mandatory suites on PRs and staging', () => {
  const paths = [
    'packages/dialtone-vue/components/button/button.vue',
    'packages/dialtone-css/lib/build/less/utilities/padding.less',
    'packages/dialtone-tokens/tokens/global.json',
    'packages/dialtone-icons/src/keywords-icons.json',
    'packages/dialtone-docs/src/content/workflows/workflow-ci-pipeline.md',
    'packages/dialtone-docs/src/generators/build-public-docs.mjs',
    'apps/dialtone-documentation/docs/components/tooltip.md',
    'scripts/build-dialtone-vue-docs.mjs',
    'scripts/lib/vue-component-identity.mjs',
    'scripts/tests/vue-component-identity.test.mjs',
    'common/utils/server.mjs',
    'packages/dialtone-query-core/src/data.ts',
    'packages/dialtone-cli/src/context.ts',
    'packages/dialtone-mcp-server/client-rules.json',
    'packages/eslint-plugin-dialtone/lib/rules/deprecated-class-props.js',
    'scripts/retrieval/cases.mjs',
    '.github/workflows/unit_tests.yml',
  ];
  for (const path of paths) {
    for (const patterns of [
      workflow.on.pull_request.paths,
      workflow.on.push.paths,
      filters.cli,
    ])
      assert.ok(
        patterns.some((pattern) => minimatch(path, pattern)),
        `lookup CI does not run for ${path}`,
      );
  }
  const docsWorkflow = parse(
    readFileSync(
      new URL(
        '../../.github/workflows/dialtone-documentation-tests.yml',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  for (const path of [
    'apps/dialtone-documentation/scripts/lib/transform-vue-api.test.mjs',
    'scripts/build-dialtone-vue-docs.mjs',
    'scripts/lib/vue-component-identity.mjs',
    'scripts/tests/vue-component-identity.test.mjs',
    'common/utils/server.mjs',
    '.github/workflows/dialtone-documentation-tests.yml',
  ])
    for (const patterns of [
      docsWorkflow.on.pull_request.paths,
      docsWorkflow.on.push.paths,
    ])
      assert.ok(
        patterns.some((pattern) => minimatch(path, pattern)),
        `documentation CI does not run for ${path}`,
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
    'scripts/retrieval/*.test.mjs',
    'run-acceptance-scenarios.mjs',
  ])
    assert.ok(
      commands.includes(required),
      `missing mandatory suite ${required}`,
    );
});
