import assert from 'node:assert/strict';
import test from 'node:test';
import { getProfile } from './profiles.mjs';
import { payloadHash } from '../../packages/dialtone-docs/src/generators/documentation-examples.mjs';
import { promoteExampleEvidence } from './example-evidence.mjs';

function fixture() {
  const profile = getProfile('dt10-pinned');
  const consumer = { dependencies: profile.dependencies, devDependencies: { vite: '8.0.3', '@vitejs/plugin-vue': '6.0.5' }, scripts: { build: 'vite build' } };
  const files = { 'package.json': JSON.stringify(consumer) + '\n', 'App.vue': '<template>Fixture</template>\n', 'main.js': '\n', 'index.html': '<div id="app"></div>\n', 'vite.config.js': '\n' };
  const record = { id: 'examples/presets/DtLoader/new', content: Object.entries(files).map(([name, value]) => '## ' + name + '\n\n```text\n' + value + '```').join('\n\n'), example: { representation: 'vue-app', profile: { id: profile.id, dependencies: profile.dependencies }, validation: { payloadHash: payloadHash({ files, dependencies: profile.dependencies }) } } };
  const artifact = { profile: profile.id, package: '@dialpad/dialtone', ...profile.artifacts['@dialpad/dialtone'] };
  const run = { profile: profile.id, artifact, node: 'v22.15.0', tooling: consumer.devDependencies, verifiedOn: '2026-10-28', lockHash: 'a'.repeat(64) };
  const report = { ...run, consumer, verification: 'built', reports: [{ id: record.id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'built', api: 'passed', checked: ['DtLoader.size'] }] };
  return { record, report, run };
}

test('promotes only validated records and preserves unchanged human evidence', () => {
  const { record, report, run } = fixture();
  const manualReview = { status: 'passed', reviewer: 'human', date: '2026-10-27' };
  const prior = { runs: { previous: run }, examples: { [record.id]: { run: 'previous', payloadHash: record.example.validation.payloadHash, manualReview }, untouched: { consumerBuild: 'unverified' } } };
  const result = promoteExampleEvidence(report, [record], prior);
  assert.equal(result.examples[record.id].consumerBuild, 'built');
  assert.deepEqual(result.examples[record.id].manualReview, manualReview);
  assert.deepEqual(result.examples.untouched, prior.examples.untouched);
  assert.deepEqual(result, promoteExampleEvidence(report, [record], result));
  assert.equal(prior.examples[record.id].consumerBuild, undefined);
});

for (const [name, change] of [
  ['payload mismatch', value => { value.reports[0].payloadHash = 'wrong'; }],
  ['retired ID', value => { value.reports[0].id = 'examples/removed'; }],
  ['duplicate result', value => { value.reports.push(value.reports[0]); }],
  ['wrong artifact', value => { value.artifact.integrity = 'wrong'; }],
  ['wrong tooling', value => { value.consumer.devDependencies.vite = '0.0.0'; }],
  ['failed consumer', value => { value.reports[0].consumerBuild = 'failed'; }],
]) {
  test(`rejects evidence with ${name}`, () => {
    const { record, report } = fixture(); change(report);
    assert.throws(() => promoteExampleEvidence(report, [record], { runs: {}, examples: {} }));
  });
}

test('does not carry stale human proof or accept a human pass from a machine report', () => {
  const { record, report, run } = fixture();
  report.reports[0].manualReview = { status: 'passed' };
  const prior = { runs: { previous: run }, examples: { [record.id]: { run: 'previous', payloadHash: 'old-payload', manualReview: { status: 'passed' } } } };
  const result = promoteExampleEvidence(report, [record], prior);
  assert.equal(result.examples[record.id].manualReview, undefined);
  assert.equal(result.examples[record.id].consumerBuild, 'built');
});

function staticFixture() {
  const { record, report } = fixture();
  const dependencies = { '@dialpad/dialtone': '10.5.1' };
  const files = { 'example.html': '<div class="d-ww-normal">Wrap</div>\n' };
  const html = { id: 'examples/utility-fixture', content: '## example.html\n\n```html\n' + files['example.html'] + '```', example: { representation: 'static-html', profile: { id: 'dt10-pinned', dependencies }, validation: { payloadHash: payloadHash({ files, dependencies }) } } };
  report.verification = 'lookup-data-only';
  report.reports = [{ id: html.id, payloadHash: html.example.validation.payloadHash, consumerBuild: 'not-applicable', api: 'not-applicable', css: 'partial', cssHash: 'b'.repeat(64), missingClasses: ['page-wrapper'], checked: ['d-ww-normal'] }];
  return { record, report, html };
}

test('promotes partial static CSS evidence without claiming an application build', () => {
  const { record, report, html } = staticFixture();
  const result = promoteExampleEvidence(report, [record, html], { runs: {}, examples: {} });
  assert.equal(result.examples[html.id].consumerBuild, 'not-applicable');
  assert.equal(result.examples[html.id].css, 'partial');
  assert.deepEqual(result.examples[html.id].missingClasses, ['page-wrapper']);
});

test('rejects static evidence when the current CSS dependency differs from the tested artifact', () => {
  const { record, report, html } = staticFixture();
  html.example.profile.dependencies['@dialpad/dialtone'] = '0.0.0';
  html.example.validation.payloadHash = payloadHash({ files: { 'example.html': '<div class="d-ww-normal">Wrap</div>\n' }, dependencies: html.example.profile.dependencies });
  report.reports[0].payloadHash = html.example.validation.payloadHash;
  assert.throws(() => promoteExampleEvidence(report, [record, html], { runs: {}, examples: {} }));
});
