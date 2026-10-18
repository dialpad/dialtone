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
    commit('packages/combinator/src/combinator.vue', 'fix(combinator): unrelated playground');
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set([ownFix, coreFix]));
    for (const hash of [coreFix, ownFix]) {
      const selected = commits.filter(commit => commit.hash === hash);
      assert.equal(await analyzeCommits(analyzerOptions, { cwd, commits: selected, logger }), 'patch');
    }
  });

  test(`${adapter} releases consumed source changes using their actual commit types`, async t => {
    const { cwd, commit, selectCommits } = repository(t, config);
    const cases = [
      ['packages/dialtone-vue/components/button/button.vue', 'fix(button): describe a public prop', 'patch'],
      ['packages/dialtone-vue/index.js', 'feat(vue): export a public component', 'minor'],
      ['scripts/build-dialtone-vue-docs.mjs', 'build(vue): update metadata generation', 'patch'],
      ['scripts/lib/vue-component-identity.mjs', 'fix(vue): correct identity generation', 'patch'],
      ['apps/dialtone-documentation/docs/components/button.md', 'docs: clarify button usage', 'patch'],
      ['packages/dialtone-vue/directives/tooltip/tooltip.mdx', 'docs(tooltip): clarify registration', 'patch'],
      ['packages/dialtone-docs/src/generators/build-public-docs.mjs', 'fix(docs): preserve literal markup', 'patch'],
      ['packages/dialtone-icons/src/keywords-icons.json', 'build(icons): update search keywords', 'patch'],
      ['packages/dialtone-icons/src/svg/icons/bell.svg', 'feat(icons): add an icon', 'minor'],
      ['packages/dialtone-css/lib/build/less/utilities/padding.less', 'style(css): correct a utility declaration', 'patch'],
      ['packages/dialtone-tokens/tokens/global.json', 'chore(tokens): update a token value', 'patch'],
      ['packages/dialtone-tokens/build-docs.js', 'build(tokens): preserve theme values', 'patch'],
      ['packages/dialtone-vue/package.json', 'chore: correct dataset version metadata', 'patch'],
      ['scripts/lib/component-name.mjs', 'refactor(core): normalize component names', 'patch'],
      ['scripts/lib/lookup-release.cjs', 'ci(release): correct source selection', 'patch'],
      ['packages/dialtone-vue/components/input/input.vue', 'feat(input): change an API\n\nBREAKING CHANGE: fixture API changed', 'major'],
      ['packages/dialtone-vue/common/constants.js', 'chore(vue): change a contract\n\nBREAKING CHANGE: fixture contract changed', 'major'],
      ['packages/dialtone-docs/src/utils/source.mjs', 'chore: change a contract\n\nBREAKING CHANGE: fixture contract changed', 'major'],
    ].map(([path, message, release]) => ({ path, hash: commit(path, message), release }));
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set(cases.map(({ hash }) => hash)));
    for (const { path, hash, release } of cases) {
      assert.equal(await analyzeCommits(analyzerOptions, {
        cwd, commits: commits.filter(commit => commit.hash === hash), logger,
      }), release, path);
    }
  });

  test(`${adapter} ignores test-only, unrelated and release-bookkeeping changes`, async t => {
    const { cwd, commit, selectCommits } = repository(t, config);
    for (const path of [
      `packages/${adapter}/tests/nested/output.test.mjs`,
      'packages/dialtone-query-core/tests/components.test.ts',
      'packages/dialtone-vue/components/button/button.test.js',
      'packages/dialtone-docs/tests/public-docs.test.js',
      'packages/combinator/src/variants/variants_button.js',
      'packages/language-server/server/src/index.ts',
      'packages/dialtone-icons/android/build.gradle',
      'packages/dialtone-query-core-extra/src/data.ts',
      'scripts/unrelated.mjs',
    ]) commit(path, 'fix(test): coverage or unrelated source');
    const ignored = [
      commit(`packages/${adapter}/package.json`, `chore(release): NO-JIRA ${adapter}/v1.0.1`),
      commit('packages/dialtone-vue/package.json', 'chore(release): NO-JIRA dialtone-vue/v4.0.1'),
      commit(`packages/${adapter}/CHANGELOG.md`, 'chore(release): NO-JIRA copied release notes\n\nBREAKING CHANGE: quoted upstream release note'),
      commit('packages/dialtone-query-core/src/data.ts', 'test(core): exercise a fixture'),
    ];
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set(ignored));
    assert.equal(await analyzeCommits(analyzerOptions, { cwd, commits, logger }), null);
  });
}
