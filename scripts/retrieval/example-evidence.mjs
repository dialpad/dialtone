import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { isDeepStrictEqual } from 'node:util';
import { getProfile } from './profiles.mjs';
import { sha256 } from './fixtures.mjs';
import { consumerTuple } from './example-consumer.mjs';
import { payloadHash } from '../../packages/dialtone-docs/src/generators/documentation-examples.mjs';

const require = createRequire(new URL('../../packages/dialtone-docs/package.json', import.meta.url));
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const filenames = ['App.vue', 'index.html', 'main.js', 'package.json', 'vite.config.js'];

export function extractExampleFiles(record) {
  const tokens = markdown.parse(record.content, {});
  const files = {};
  const expected = record.example.representation === 'static-html' ? ['example.html'] : filenames;
  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type !== 'fence') continue;
    const name = tokens[index - 2]?.content;
    assert.ok(expected.includes(name) && !(name in files), `Unexpected or duplicate file ${name}`);
    files[name] = tokens[index].content;
  }
  assert.deepEqual(Object.keys(files).sort(), expected);
  assert.equal(payloadHash({ files, dependencies: record.example.profile.dependencies }),
    record.example.validation.payloadHash);
  return files;
}

/** Machine proof is promoted explicitly; it never selects sources or creates human evidence. */
export function promoteExampleEvidence(report, records, evidence) {
  const profile = getProfile(report.profile);
  const artifact = profile.artifacts[report.artifact?.package];
  assert.ok(artifact && report.artifact.profile === profile.id, 'Unknown consumer artifact/profile');
  assert.equal(report.artifact.version, artifact.version);
  assert.equal(report.artifact.integrity, artifact.integrity);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(report.verifiedOn) && report.node, 'Missing run date/runtime');
  assert.match(report.lockHash, /^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(report.reports) && report.reports.length, 'No consumer results');
  const manifestRecord = records.find(record => record.example?.representation === 'vue-app');
  assert.ok(manifestRecord, 'No current consumer manifest');
  const expected = consumerTuple(JSON.parse(extractExampleFiles(manifestRecord)['package.json']));
  assert.deepEqual(consumerTuple(report.consumer), expected);
  assert.deepEqual(expected.dependencies, profile.dependencies);
  assert.deepEqual(report.tooling, expected.devDependencies);
  const run = { profile: profile.id, node: report.node, tooling: report.tooling,
    verifiedOn: report.verifiedOn, lockHash: report.lockHash, artifact: report.artifact };
  const runId = `${profile.id}-${sha256(JSON.stringify(run)).slice(0, 16)}`;
  const examples = { ...evidence.examples };
  const ids = new Set();
  for (const result of report.reports) {
    assert.ok(!ids.has(result.id), `Duplicate consumer result: ${result.id}`);
    ids.add(result.id);
    const record = records.find(record => record.id === result.id && record.example);
    assert.ok(record, `Unknown or retired example: ${result.id}`);
    extractExampleFiles(record);
    assert.equal(record.example.profile.id, profile.id);
    assert.equal(result.payloadHash, record.example.validation.payloadHash, `Stale payload: ${result.id}`);
    const staticHtml = record.example.representation === 'static-html';
    assert.deepEqual(record.example.profile.dependencies, staticHtml
      ? { '@dialpad/dialtone': profile.dependencies['@dialpad/dialtone'] } : profile.dependencies);
    if (staticHtml) {
      assert.match(result.cssHash, /^[a-f0-9]{64}$/);
      assert.ok(['built', 'lookup-data-only'].includes(report.verification));
      assert.equal(result.consumerBuild, 'not-applicable');
      assert.equal(result.api, 'not-applicable');
      assert.ok(['passed', 'partial'].includes(result.css));
    } else {
      assert.equal(report.verification, 'built');
      assert.equal(result.consumerBuild, 'built');
      assert.equal(result.api, 'passed');
      assert.deepEqual(consumerTuple(JSON.parse(extractExampleFiles(record)['package.json'])), expected);
    }
    assert.ok(Array.isArray(result.checked) && result.checked.every(value => typeof value === 'string'));
    const old = evidence.examples[result.id];
    const oldRun = evidence.runs[old?.run];
    const keepManual = old?.payloadHash === result.payloadHash && oldRun?.profile === profile.id
      && isDeepStrictEqual(oldRun.artifact, report.artifact) && isDeepStrictEqual(oldRun.tooling, report.tooling);
    examples[result.id] = { run: runId, payloadHash: result.payloadHash,
      consumerBuild: result.consumerBuild, api: result.api,
      ...(staticHtml ? { css: result.css, cssHash: result.cssHash, missingClasses: result.missingClasses } : {}),
      checked: result.checked,
      ...(keepManual && old.manualReview ? { manualReview: old.manualReview } : {}) };
  }
  return { runs: { ...evidence.runs, [runId]: run }, examples };
}
