import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
// Use the exact installed release implementation, without invoking any release plugins.
const releaseRequire = createRequire(require.resolve('semantic-release-plus/package.json'));
const getCommits = releaseRequire('./lib/get-commits.js');
const { analyzeCommits } = releaseRequire('@semantic-release/commit-analyzer');
const logger = { log() {} };

function repository(t, options) {
  const cwd = mkdtempSync(join(tmpdir(), 'dialtone-release-paths-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  git('init', '--quiet');
  git('config', 'user.name', 'Release path test');
  git('config', 'user.email', 'release-path-test@example.invalid');
  git('config', 'core.hooksPath', '/dev/null');
  git('config', 'commit.gpgsign', 'false');
  git('commit', '--quiet', '--allow-empty', '-m', 'chore: baseline');
  const baseline = git('rev-parse', 'HEAD');
  const commit = (path, message) => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), message);
    git('add', path);
    git('commit', '--quiet', '-m', message);
    return git('rev-parse', 'HEAD');
  };
  const selectCommits = () => getCommits({
    cwd, env: process.env, lastRelease: { gitHead: baseline }, logger, options,
  });
  return { cwd, commit, selectCommits };
}

for (const adapter of ['dialtone-cli', 'dialtone-mcp-server']) {
  const config = require(`../../${adapter}/release-ci.config.cjs`);
  const analyzerOptions = config.plugins.find(([name]) => name === '@semantic-release/commit-analyzer')[1];

  test(`${adapter} selects nested shared-core fixes and its own fixes for patch release`, async t => {
    const { cwd, commit, selectCommits } = repository(t, config);
    const coreFix = commit('packages/dialtone-query-core/src/tools/components.ts', 'fix(query-core): exact component');
    const ownFix = commit(`packages/${adapter}/src/nested/startup.ts`, `fix(${adapter}): startup`);
    commit('packages/dialtone-query-core-extra/src/tools/components.ts', 'fix(other): unrelated sibling');
    commit('packages/dialtone-vue/components/text/text.vue', 'fix(vue): unrelated component');
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set([ownFix, coreFix]));
    for (const hash of [coreFix, ownFix]) {
      const selected = commits.filter(commit => commit.hash === hash);
      assert.equal(await analyzeCommits(analyzerOptions, { cwd, commits: selected, logger }), 'patch');
    }
  });

  test(`${adapter} does not release for shared-core test-only commits`, async t => {
    const { cwd, commit, selectCommits } = repository(t, config);
    commit('packages/dialtone-query-core/tests/components.test.ts', 'test(query-core): exact component coverage');
    const commits = await selectCommits();
    assert.equal(commits.length, 1);
    assert.equal(await analyzeCommits(analyzerOptions, { cwd, commits, logger }), null);
  });
}
