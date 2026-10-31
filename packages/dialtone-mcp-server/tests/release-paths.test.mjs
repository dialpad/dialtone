import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
// Exercise the installed selector/analyzer/notes hooks without releasing or publishing.
const releaseRequire = createRequire(require.resolve('semantic-release-plus/package.json'));
const getCommits = releaseRequire('./lib/get-commits.js');
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
    for (const file of [path].flat()) {
      mkdirSync(dirname(join(cwd, file)), { recursive: true });
      writeFileSync(join(cwd, file), message);
      git('add', file);
    }
    git('commit', '--quiet', '-m', message);
    return git('rev-parse', 'HEAD');
  };
  const selectCommits = () => getCommits({
    cwd, env: process.env, lastRelease: { gitHead: baseline }, logger, options,
  });
  return { cwd, baseline, commit, selectCommits };
}

for (const adapter of ['dialtone-cli', 'dialtone-mcp-server']) {
  const config = require(`../../${adapter}/release-ci.config.cjs`);
  const [pluginPath, pluginOptions] = config.plugins[0];
  const { analyzeCommits, generateNotes } = require(pluginPath);

  test(`${adapter} releases its own and consumed source changes using their actual commit types`, async t => {
    const { cwd, baseline, commit, selectCommits } = repository(t, config);
    const cases = [
      [`packages/${adapter}/src/nested/startup.ts`, `fix(${adapter}): startup`, 'patch'],
      ['packages/dialtone-query-core/src/tools/components.ts', 'fix(query-core): exact component', 'patch'],
      ['packages/dialtone-vue/components/button/button.vue', 'fix(button): describe a public prop', 'patch'],
      ['packages/dialtone-vue/index.js', 'feat(vue): export a public component', 'minor'],
      ['scripts/build-dialtone-vue-docs.mjs', 'build(vue): update metadata generation', 'patch'],
      ['scripts/lib/vue-component-identity.mjs', 'fix(vue): correct identity generation', 'patch'],
      ['apps/dialtone-documentation/docs/components/button.md', 'docs: clarify button usage', 'patch'],
      ['packages/dialtone-vue/directives/tooltip/tooltip.mdx', 'docs(tooltip): clarify registration', 'patch'],
      ['packages/dialtone-docs/src/generators/build-public-docs.mjs', 'fix(docs): preserve literal markup', 'patch'],
      ['packages/dialtone-docs/scripts/generate-example-guidance.mjs', 'fix(docs): correct guidance generation', 'patch'],
      ['apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js', 'docs(examples): adjust authored fence parsing', 'patch'],
      ['scripts/retrieval/profiles.mjs', 'chore(examples): update the tested consumer profile', 'patch'],
      ['packages/combinator/src/variants/variants_loader.js', 'fix(combinator): update a curated preset', 'patch'],
      ['scripts/retrieval/example-consumer.mjs', 'fix(examples): correct preset API validation', 'patch'],
      ['packages/dialtone-icons/src/IconTemplate.vue', 'fix(icons): correct generated icon props', 'patch'],
      ['packages/dialtone-icons/vue/vite.config.js', 'build(icons): update the Vue icon bundle', 'patch'],
      ['packages/combinator/src/variants/variants_loader.js', 'refactor(combinator): retire a source preset\n\nBREAKING CHANGE: upstream preset ID retired', 'patch'],
      ['packages/dialtone-icons/src/keywords-icons.json', 'build(icons): update search keywords', 'patch'],
      ['packages/dialtone-icons/src/svg/icons/bell.svg', 'feat(icons): add an icon', 'minor'],
      ['packages/dialtone-css/lib/build/less/utilities/padding.less', 'style(css): correct a utility declaration', 'patch'],
      ['packages/dialtone-tokens/tokens/global.json', 'chore(tokens): update a token value', 'patch'],
      ['packages/dialtone-tokens/build-docs.js', 'build(tokens): preserve theme values', 'patch'],
      ['packages/dialtone-vue/package.json', 'chore: correct dataset version metadata', 'patch'],
      ['apps/dialtone-documentation/package.json', 'build(docs): update the link parser dependency', 'patch'],
      ['scripts/lib/component-name.mjs', 'refactor(core): normalize component names', 'patch'],
      ['lookup-release.config.cjs', 'ci(release): correct source selection', 'patch'],
      ['packages/dialtone-vue/components/input/input.vue', 'refactor(input): change an API\n\nBREAKING CHANGE: upstream API changed', 'patch'],
      ['packages/dialtone-vue/common/constants.js', 'chore(vue): change a contract\n\nBREAKING CHANGE: upstream contract changed', 'patch'],
      ['packages/dialtone-docs/src/utils/source.mjs', 'chore: change a contract\n\nBREAKING CHANGE: upstream documentation changed', 'patch'],
      [['packages/dialtone-vue/index.js', 'packages/dialtone-query-core/tests/data.test.ts'], 'refactor(vue): change source with regression coverage\n\nBREAKING CHANGE: upstream with tests changed', 'patch'],
      [`packages/${adapter}/src/api.ts`, 'refactor(tool): change a tool API\n\nBREAKING CHANGE: tool contract changed', 'major'],
      ['packages/dialtone-query-core/src/types.ts', 'refactor(core): change a shared API\n\nBREAKING CHANGE: shared contract changed', 'major'],
      ['scripts/lib/component-name.mjs', 'refactor(core): change runtime identity matching\n\nBREAKING CHANGE: shared identity changed', 'major'],
      [['packages/dialtone-vue/index.js', `packages/${adapter}/src/api.ts`], 'feat(tool): change source and tool contracts\n\nBREAKING CHANGE: mixed contract changed', 'major'],
    ].map(([path, message, release]) => ({ path, hash: commit(path, message), release }));
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set(cases.map(({ hash }) => hash)));
    for (const { path, hash, release } of cases) {
      assert.equal(await analyzeCommits(pluginOptions, {
        cwd, commits: commits.filter(selected => selected.hash === hash), logger,
      }), release, path);
    }
    const notes = await generateNotes(pluginOptions, {
      cwd, commits, lastRelease: { gitHead: baseline, gitTag: 'v1.0.0' },
      nextRelease: { version: '2.0.0', gitTag: 'v2.0.0' },
      options: { repositoryUrl: 'https://github.com/dialpad/dialtone.git' },
    });
    const groups = notes.split('### ');
    const sourceNotes = groups.find(group => group.startsWith('Bundled Dialtone data changes'));
    const contractNotes = groups.find(group => group.startsWith('BREAKING CHANGES'));
    assert.match(sourceNotes, /upstream API changed/);
    assert.doesNotMatch(sourceNotes, /tool contract changed/);
    assert.match(contractNotes, /tool contract changed/);
    assert.doesNotMatch(contractNotes, /upstream API changed/);
  });

  test(`${adapter} ignores test-only, unrelated and release-bookkeeping changes`, async t => {
    const { cwd, baseline, commit, selectCommits } = repository(t, config);
    for (const path of [
      `packages/${adapter}/tests/nested/output.test.mjs`,
      'packages/dialtone-query-core/tests/components.test.ts',
      'packages/dialtone-vue/components/button/button.test.js',
      'packages/dialtone-docs/tests/public-docs.test.js',
      'scripts/lib/__tests__/lookup-release.cjs',
      'scripts/lib/__fixtures__/lookup-release.js',
      'scripts/lib/lookup-release.spec.cjs',
      'packages/combinator/src/variants/variants_button.test.js',
      'packages/language-server/server/src/index.ts',
      'packages/dialtone-icons/android/build.gradle',
      'packages/dialtone-query-core-extra/src/data.ts',
      'scripts/unrelated.mjs',
    ]) commit(path, 'fix(test): coverage or unrelated source');
    commit('packages/dialtone-mcp-server/test-search.js', 'chore(test): exercise MCP search');
    const ignored = [
      commit(`packages/${adapter}/package.json`, `chore(release): NO-JIRA ${adapter}/v1.0.1`),
      commit('packages/dialtone-vue/package.json', 'chore(release): NO-JIRA dialtone-vue/v4.0.1'),
      commit(`packages/${adapter}/CHANGELOG.md`, 'chore(release): NO-JIRA copied release notes\n\nBREAKING CHANGE: quoted upstream release note'),
      commit('packages/dialtone-query-core/src/data.ts', 'test(core): exercise a fixture'),
    ];
    const commits = await selectCommits();
    assert.deepEqual(new Set(commits.map(({ hash }) => hash)), new Set(ignored));
    assert.equal(await analyzeCommits(pluginOptions, { cwd, commits, logger }), null);
    const message = 'fix(core): retain an actual lookup correction';
    const hash = commit('packages/dialtone-query-core/src/data.ts', message);
    const notes = await generateNotes(pluginOptions, {
      cwd, commits: [...commits, { hash, message }],
      lastRelease: { gitHead: baseline, gitTag: 'v1.0.0' },
      nextRelease: { version: '1.0.1', gitTag: 'v1.0.1' },
      options: { repositoryUrl: 'https://github.com/dialpad/dialtone.git' },
    });
    assert.match(notes, /retain an actual lookup correction/);
    assert.doesNotMatch(notes, /quoted upstream release note|copied release notes/);
  });
}
