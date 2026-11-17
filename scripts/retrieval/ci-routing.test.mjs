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
  assert.equal(verifyStep.env.ATTEMPTS, undefined, 'unrelated publish failures must not shorten registry availability polling');
  assert.doesNotMatch(verifyStep.run, /--attempts/, 'use the verifier default shared availability budget');
  for (const [name, job] of Object.entries(publish.jobs)) {
    assert.ok(!job['continue-on-error'] && job.steps.every(step => !step['continue-on-error']), `${name} hides a failed gate`);
    for (const step of job.steps.filter(step => step.uses?.startsWith('actions/checkout')))
      assert.equal(step.with?.ref, name === 'variables-setup' ? '${{ steps.source.outputs.source_sha }}' : '${{ needs.variables-setup.outputs.source_sha }}', `${name} is not pinned to the prepared commit`);
    for (const step of job.steps.filter(step => /release-archives|qualify-release/.test(step.run ?? '')))
      assert.doesNotMatch(step.run, /\$\{\{\s*needs\./, `${name} interpolates job outputs into the shell`);
  }
  assertRouted('release qualification', ['scripts/retrieval/qualify-release-examples.mjs', 'scripts/retrieval/release-archives.mjs', 'scripts/retrieval/release-profile.mjs', '.github/workflows/publish-web.yml', '.github/workflows/release.yml',
    'gulpfile.cjs', 'entry/vue3.js', 'packages/dialtone-emojis/package.json'],
    [workflow.on.pull_request.paths, workflow.on.push.paths, filters.cli]);
  assert.match(runs(workflow.jobs['qualify-lookup-candidate']), /qualify-release-examples\.mjs\s+--mode candidate/);
});

test('pnpm publication attaches the release branch without moving the qualified source', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const steps = readWorkflow('publish-web.yml').jobs.publish.steps;
  const attach = steps.find(step => step.name === 'Attach publication branch at pinned source');
  assert.ok(attach, 'pnpm requires a named branch even when source is pinned');
  const rebuilt = steps.find(step => /:publish/.test(step.run ?? ''));
  assert.equal(attach.if, rebuilt.if, 'only the Nx/pnpm publication path needs an attached branch');
  assert.ok(steps.indexOf(attach) < steps.indexOf(rebuilt));
  assert.equal(attach.env.RELEASE_SHA, '${{ needs.variables-setup.outputs.source_sha }}');
  assert.equal(attach.env.RELEASE_BRANCH, '${{ needs.variables-setup.outputs.current_branch }}');
  const dir = mkdtempSync(join(tmpdir(), 'publish-checkout-'));
  const run = (file, args, env = {}) => execFileSync(file, args, {
    cwd: dir, encoding: 'utf8', stdio: 'pipe', timeout: 30000,
    env: { ...process.env, pnpm_config_cache_dir: join(dir, 'cache'), pnpm_config_offline: 'true',
      pnpm_config_update_notifier: 'false', ...env },
  }).trim();
  const git = (...args) => run('git', args);
  try {
    git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
    git('config', 'commit.gpgsign', 'false');
    const { packageManager } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'publication-dry-run-fixture', version: '1.0.0', packageManager }));
    writeFileSync(join(dir, '.npmrc'), 'publish-branch=production\n');
    writeFileSync(join(dir, '.gitignore'), 'cache/\n*.tgz\n');
    git('add', 'package.json', '.npmrc', '.gitignore'); git('commit', '-qm', 'release');
    const sha = git('rev-parse', 'HEAD');
    git('checkout', '--detach', '-q', sha);
    assert.throws(() => run('pnpm', ['publish', '--dry-run']), error => /ERR_PNPM_GIT_UNKNOWN_BRANCH/.test(error.stdout));
    // A named branch at a different commit is not an acceptable substitute for the pinned source.
    git('commit', '--allow-empty', '-qm', 'another source');
    const otherSha = git('rev-parse', 'HEAD');
    git('checkout', '--detach', '-q', sha);
    const attachAt = (branch, source = sha) => run('bash', ['-e', '-o', 'pipefail', '-c', attach.run],
      { RELEASE_SHA: source, RELEASE_BRANCH: branch });
    assert.throws(() => attachAt('production', otherSha));
    for (const branch of ['production', 'next']) {
      attachAt(branch);
      assert.equal(git('branch', '--show-current'), branch);
      assert.equal(git('rev-parse', 'HEAD'), sha);
      run('pnpm', ['publish', '--dry-run', `--publish-branch=${branch}`]);
      git('checkout', '--detach', '-q', sha);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('prerelease publication dispatches the complete prepared batch and preserves manual/production entry points', () => {
  const release = readWorkflow('release.yml');
  const publish = readWorkflow('publish-web.yml');
  const handoff = release.jobs['publish-prerelease'];
  assert.ok(handoff, 'prereleases need a final preparation handoff');
  assert.deepEqual(handoff.needs, ['get-branch-name', 'release']);
  assert.match(handoff.if, /alpha.*beta.*next/);
  const dispatch = handoff.steps.find(step => /gh workflow run publish-web\.yml/.test(step.run ?? ''));
  assert.ok(dispatch, 'dispatch the publisher as a top-level workflow to preserve its npm identity');
  assert.equal(dispatch.env.RELEASE_SHA, '${{ needs.release.outputs.release_sha }}');
  assert.equal(dispatch.env.RELEASE_BASE, '${{ needs.release.outputs.base_sha }}');
  assert.match(dispatch.run, /--ref "\$RELEASE_BRANCH"/);
  for (const key of ['release_sha', 'release_base', 'release_branch']) assert.match(dispatch.run, new RegExp(key + '='));
  assert.equal(dispatch.env.GH_TOKEN, '${{ secrets.DIALTONE_CI_TOKEN }}');
  assert.equal(publish.on.workflow_call, undefined);
  assert.deepEqual(publish.on.push.branches, ['production']);
  assert.ok(publish.on.workflow_dispatch.inputs.package);
  for (const key of ['release_sha', 'release_base', 'release_branch'])
    assert.equal(publish.on.workflow_dispatch.inputs[key].type, 'string');
  const filter = publish.jobs['filter-actions'];
  const path = filter.steps.find(step => step.id === 'filter-path');
  assert.match(path.with.base, /inputs\.release_base/);
  assert.match(path.with.base, /github\.event\.before/);
  assert.match(path.with.ref, /outputs\.source_sha/);
  assert.match(path.if, /inputs\.release_sha/);
  assert.match(filter.steps.find(step => step.id === 'filter-input').if, /!inputs\.release_sha/);
  assert.match(publish.jobs.publish.if, /outputs\.packages != '\[\]'/);
});

test('release bounds select the whole Git batch and validate pinned prerelease ancestry', async () => {
  const { mkdtempSync, writeFileSync, mkdirSync, rmSync, chmodSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const dir = mkdtempSync(join(tmpdir(), 'release-batch-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  const release = readWorkflow('release.yml');
  const steps = release.jobs.release.steps;
  const before = steps.find(step => step.id === 'release-base');
  const after = steps.find(step => step.id === 'release-final');
  assert.ok(before && after, 'capture bounds around all semantic-release steps');
  const versions = steps.map((step, index) => /:release\b/.test(step.run ?? '') ? index : -1).filter(index => index >= 0);
  assert.ok(steps.indexOf(before) < Math.min(...versions) && steps.indexOf(after) > Math.max(...versions));
  const output = join(dir, 'outputs');
  const history = join(dir, 'history.json');
  const jobs = join(dir, 'jobs');
  mkdirSync(jobs);
  const bin = join(dir, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), `#!/bin/sh
case "$4" in
  */jobs) id=$(printf '%s' "$4" | cut -d/ -f6); cat "$FIXTURE_JOBS/$id.json" ;;
  *) cat "$FIXTURE_HISTORY" ;;
esac
`);
  chmodSync(join(bin, 'gh'), 0o755);
  writeFileSync(history, '[{"workflow_runs":[]}]');
  const shell = (run, env = {}) => execFileSync('bash', ['-e', '-o', 'pipefail', '-c', run],
    { cwd: dir, env: { ...process.env, PATH: bin + ':' + process.env.PATH, FIXTURE_HISTORY: history, FIXTURE_JOBS: jobs, RUNNER_TEMP: dir, GITHUB_RUN_ID: '30', GH_REPO: 'fixture/repo', RELEASE_BRANCH: 'alpha', GITHUB_OUTPUT: output, ...env }, encoding: 'utf8', stdio: 'pipe' });
  const prepared = (id, conclusions) => writeFileSync(join(jobs, `${id}.json`), JSON.stringify(
    conclusions.map(conclusion => ({ jobs: [{ name: 'release', steps: [{ name: 'Record release base', conclusion }] }] }))));
  try {
    git('init', '-q'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'user.name', 'Fixture');
    writeFileSync(join(dir, 'package.json'), '{"version":"1.0.0"}'); git('add', 'package.json'); git('commit', '-qm', 'base');
    const base = git('rev-parse', 'HEAD');
    git('update-ref', 'refs/remotes/origin/alpha', base);
    shell(before.run);
    for (const name of ['dialtone-mcp-server', 'dialtone-cli']) {
      mkdirSync(join(dir, 'packages', name), { recursive: true });
      writeFileSync(join(dir, 'packages', name, 'package.json'), '{"version":"2.0.0-alpha.1"}');
      git('add', 'packages'); git('commit', '-qm', name);
    }
    const adapter = git('rev-parse', 'HEAD');
    git('update-ref', 'refs/remotes/origin/alpha', adapter);
    // A failed previous run prepared adapters but never dispatched publication.
    const unfinished = { id: 25, status: 'completed', conclusion: 'failure', head_sha: adapter };
    const previous = [
      { workflow_runs: [unfinished, { id: 20, status: 'completed', conclusion: 'cancelled', head_sha: base }] },
      { workflow_runs: [{ id: 10, status: 'completed', conclusion: 'success', head_sha: base }] },
    ];
    writeFileSync(history, JSON.stringify(previous));
    prepared(25, ['failure', 'success']); // All attempts: a rejected retry must not hide prior preparation.
    prepared(20, ['success']);
    shell(before.run);
    const resumedBase = Object.fromEntries(readFileSync(output, 'utf8').trim().split('\n').map(line => line.split('='))).base_sha;
    assert.equal(resumedBase, base, 'resume must include the already-prepared adapters');
    writeFileSync(history, JSON.stringify([{ workflow_runs: [{ ...unfinished, status: 'in_progress' }] }]));
    assert.throws(() => shell(before.run));
    writeFileSync(history, JSON.stringify([{ workflow_runs: [unfinished] }]));
    assert.throws(() => shell(before.run));
    writeFileSync(history, JSON.stringify(previous));
    const cliBase = git('rev-parse', 'HEAD^');
    assert.deepEqual(git('diff', '--name-only', cliBase, adapter).split('\n'), ['packages/dialtone-cli/package.json']);
    writeFileSync(join(dir, 'package.json'), '{"version":"2.0.0-alpha.1"}'); git('add', 'package.json'); git('commit', '-qm', 'umbrella');
    const final = git('rev-parse', 'HEAD'); shell(after.run);
    const outputs = Object.fromEntries(readFileSync(output, 'utf8').trim().split('\n').map(line => line.split('=')));
    assert.deepEqual(outputs, { base_sha: base, release_sha: final });
    const changed = (first, last) => git('diff', '--name-only', first, last).split('\n').filter(Boolean);
    assert.deepEqual(changed(adapter, final), ['package.json']); // Old last-push selection misses adapters.
    assert.deepEqual(changed(outputs.base_sha, outputs.release_sha), ['package.json', 'packages/dialtone-cli/package.json', 'packages/dialtone-mcp-server/package.json']);
    assert.deepEqual(changed(base, base), []); // No prepared release means no publication.
    git('update-ref', 'refs/remotes/origin/alpha', final);
    // A prepared and succeeded; B was rejected while A was active. B must not replay A's versions.
    writeFileSync(history, JSON.stringify([{ workflow_runs: [
      { id: 27, status: 'completed', conclusion: 'failure', head_sha: base },
      { id: 26, status: 'completed', conclusion: 'success', head_sha: base },
    ] }]));
    prepared(27, ['failure']);
    shell(before.run);
    const nextBase = Object.fromEntries(readFileSync(output, 'utf8').trim().split('\n').map(line => line.split('='))).base_sha;
    assert.equal(nextBase, final, 'a rejected overlap must not reselect already-prepared versions');
    writeFileSync(join(jobs, '27.json'), JSON.stringify([{ jobs: [{ name: 'release', steps: [] }] }]));
    assert.throws(() => shell(before.run), /./, 'missing preparation provenance must fail closed');
    prepared(27, ['failure']);
    git('checkout', '--detach', '-q', base);
    assert.throws(() => shell(before.run), /./, 'an old rejected run cannot prepare from stale source');
    git('checkout', '--detach', '-q', final);
    const validate = readWorkflow('publish-web.yml').jobs['variables-setup'].steps.find(step => step.name === 'Validate prepared release range');
    assert.ok(validate, 'validate the pinned range, not a moving branch');
    git('update-ref', 'refs/remotes/origin/alpha', final);
    const env = { RELEASE_BASE: base, RELEASE_SHA: final, RELEASE_BRANCH: 'alpha' };
    shell(validate.run, env);
    assert.throws(() => shell(validate.run, { ...env, RELEASE_BASE: final, RELEASE_SHA: adapter }));
    git('update-ref', 'refs/remotes/origin/beta', base);
    assert.throws(() => shell(validate.run, { ...env, RELEASE_BRANCH: 'beta' }));
    const select = readWorkflow('publish-web.yml').jobs['variables-setup'].steps.find(step => step.id === 'source');
    shell(select.run, { ...env, EVENT_SHA: base, EVENT_BRANCH: 'alpha' });
    const selected = Object.fromEntries(readFileSync(output, 'utf8').trim().split('\n').map(line => line.split('=')));
    assert.equal(selected.source_sha, final);
    assert.equal(selected.tag, 'alpha');
    assert.throws(() => shell(select.run, { ...env, EVENT_BRANCH: 'beta' }));
    assert.throws(() => shell(select.run, { ...env, EVENT_BRANCH: 'alpha', RELEASE_SHA: 'HEAD' }));
    assert.throws(() => shell(select.run, { ...env, EVENT_BRANCH: 'alpha', RELEASE_SHA: '' }));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
