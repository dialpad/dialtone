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

test('release qualification precedes publication and gates overall release success', () => {
  const publish = readWorkflow('publish-web.yml');
  const { qualify, publish: matrix, 'verify-release': verify } = publish.jobs;
  const runs = job => job.steps.map(step => step.run ?? '').join('\n');
  assert.match(runs(publish.jobs['filter-actions']), /release-archives\.mjs select/);
  assert.match(runs(qualify), /qualify-release-examples\.mjs\s+--mode release/);
  const qualifyStep = qualify.steps.find(step => /qualify-release-examples\.mjs/.test(step.run ?? ''));
  assert.match(qualifyStep.env.QUALIFIED, /outputs\.qualified/, 'qualification must know the selected packages');
  assert.match(qualifyStep.run, /--package/);
  for (const [job, needs] of [[matrix, ['qualify']], [verify, ['qualify', 'publish']]]) {
    assert.ok(needs.every(name => job.needs.includes(name)));
    // `!cancelled()` drops the implicit success requirement on every upstream job.
    for (const upstream of ['variables-setup', 'filter-actions']) assert.ok(job.if.includes(`needs.${upstream}.result == 'success'`), upstream);
  }
  // Qualified packages publish only after qualification passes; a failed qualification fails their
  // matrix legs explicitly while unrelated packages keep publishing. Verification needs a qualified run.
  assert.ok(matrix.if.includes('needs.check-dialpad-member.result == \'success\''));
  const qualifiedSteps = matrix.steps.filter(step => step.if?.includes('outputs.qualified') && !step.if.startsWith('${{ !'));
  const stop = qualifiedSteps.find(step => /exit 1/.test(step.run ?? ''));
  assert.match(stop.if, /needs\.qualify\.result != 'success'/);
  for (const step of qualifiedSteps.filter(step => step !== stop))
    assert.match(step.if, /needs\.qualify\.result == 'success'/, step.name);
  assert.ok(verify.if.includes('needs.qualify.result == \'success\''));
  // No concurrency group: GitHub keeps one pending run per group and would silently cancel a
  // queued publication. Overlapping runs instead fail loudly on the immutable-bytes check.
  assert.equal(publish.concurrency, undefined);
  // Qualified packages publish their archives; all others keep the rebuild step.
  const qualified = matrix.steps.find(step => /release-archives\.mjs publish/.test(step.run ?? ''));
  const rebuilt = matrix.steps.find(step => /:publish/.test(step.run ?? ''));
  const selected = 'contains(fromJSON(needs.filter-actions.outputs.qualified), matrix.package)';
  assert.ok(qualified.if.includes(selected) && rebuilt.if.includes('!' + selected));
  const verifyStep = verify.steps.find(step => /release-archives\.mjs verify/.test(step.run ?? ''));
  assert.match(verifyStep.env.QUALIFIED, /outputs\.qualified/, 'verify must receive every qualified package');
  for (const [name, job] of Object.entries(publish.jobs)) {
    assert.ok(!job['continue-on-error'] && job.steps.every(step => !step['continue-on-error']), `${name} hides a failed gate`);
    for (const step of job.steps.filter(step => step.uses?.startsWith('actions/checkout')))
      assert.equal(step.with?.ref, '${{ github.sha }}', `${name} is not pinned to the prepared commit`);
    for (const step of job.steps.filter(step => /release-archives|qualify-release/.test(step.run ?? '')))
      assert.doesNotMatch(step.run, /\$\{\{\s*needs\./, `${name} interpolates job outputs into the shell`);
  }
  assertRouted('release qualification', ['scripts/retrieval/qualify-release-examples.mjs', 'scripts/retrieval/release-archives.mjs', 'scripts/retrieval/release-profile.mjs', '.github/workflows/publish-web.yml',
    'gulpfile.cjs', 'entry/vue3.js', 'packages/dialtone-emojis/package.json'],
    [workflow.on.pull_request.paths, workflow.on.push.paths, filters.cli]);
  assert.match(runs(workflow.jobs['qualify-lookup-candidate']), /qualify-release-examples\.mjs\s+--mode candidate/);
});
