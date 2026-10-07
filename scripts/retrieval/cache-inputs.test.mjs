import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
const require = createRequire(import.meta.url);
assert.equal(
  require('nx/package.json').version,
  '19.8.0',
  'Nx private input contracts require 19.8.0; inspect the new implementation before updating this guard',
);
const {
  getInputs,
  filterUsingGlobPatterns,
} = require('nx/src/hasher/task-hasher');
const nx = JSON.parse(readFileSync(new URL('../../nx.json', import.meta.url)));
const generatorInputs = [
  'scripts/build-dialtone-vue-docs.mjs',
  'scripts/lib/vue-component-identity.mjs',
  'common/utils/server.mjs',
];
function inputs(name) {
  const root = `packages/${name}`;
  const config = JSON.parse(
    readFileSync(new URL(`../../${root}/project.json`, import.meta.url)),
  );
  const graph = {
    nodes: { [name]: { name, type: 'lib', data: { ...config, root } } },
    dependencies: { [name]: [] },
  };
  return getInputs(
    {
      id: `${name}:build`,
      target: { project: name, target: 'build' },
      overrides: {},
    },
    graph,
    nx,
  );
}
function covered(paths, patterns) {
  if (!patterns.length) return [];
  return filterUsingGlobPatterns(
    '.',
    paths.map((file) => ({ file, hash: 'probe' })),
    patterns,
  ).map((value) => value.file);
}
// Workspace-relative file patterns from a project's own build inputs.
function selfPatterns(name) {
  return inputs(name)
    .selfInputs.filter((input) => input.fileset)
    .map((input) =>
      input.fileset
        .replace('{workspaceRoot}/', '')
        .replace('{projectRoot}', `packages/${name}`),
    );
}
test('Vue generator and its shared helpers participate in the build hash', () => {
  assert.deepEqual(
    covered(generatorInputs, selfPatterns('dialtone-vue')),
    generatorInputs,
  );
});
test('standalone Vue release selection includes generator and shared-helper fixes', async () => {
  const directory = await mkdtemp(
    join(tmpdir(), 'dialtone-release-selection-'),
  );
  const git = (...args) =>
    execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
  const commit = (message) =>
    git(
      '-c',
      'user.name=Retrieval fixture',
      '-c',
      'user.email=retrieval@example.invalid',
      '-c',
      'commit.gpgsign=false',
      '-c',
      'core.hooksPath=/dev/null',
      'commit',
      '--quiet',
      '-m',
      message,
    );
  try {
    git('init', '--quiet');
    await writeFile(join(directory, 'README.md'), 'release selection fixture');
    git('add', 'README.md');
    commit('chore: initial fixture');
    const from = git('rev-parse', 'HEAD');
    const paths = [
      ...generatorInputs,
      'scripts/lib/nested/helper.mjs',
      'packages/dialtone-vue/components/button/button.vue',
    ];
    const unrelated = 'scripts/unrelated.mjs';
    for (const path of [...paths, unrelated]) {
      await mkdir(dirname(join(directory, path)), { recursive: true });
      await writeFile(join(directory, path), 'fixture');
      git('add', path);
      commit(`fix(vue): DLT-3652 ${path}`);
    }
    const getCommits = require('semantic-release-plus/lib/get-commits');
    const config = require('../../packages/dialtone-vue/release-ci.config.cjs');
    const selected = await getCommits({
      cwd: directory,
      lastRelease: { gitHead: from },
      logger: { log() {} },
      options: { commitPaths: config.commitPaths },
    });
    assert.deepEqual(
      selected.map((value) => value.message).sort(),
      paths.map((path) => `fix(vue): DLT-3652 ${path}`).sort(),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
test('MCP client rules participate in the build hash', () => {
  assert.deepEqual(
    covered(
      ['packages/dialtone-mcp-server/client-rules.json'],
      selfPatterns('dialtone-mcp-server'),
    ),
    ['packages/dialtone-mcp-server/client-rules.json'],
  );
});
test('core and adapters hash the generated data they consume through dependency outputs', () => {
  const consumed = [
    'packages/dialtone-css/lib/dist/dialtone-docs.json',
    'packages/dialtone-css/lib/dist/tokens-docs.json',
    'packages/dialtone-vue/dist/component-documentation.json',
    'packages/dialtone-docs/dist/public-docs.json',
  ];
  for (const name of [
    'dialtone-query-core',
    'dialtone-cli',
    'dialtone-mcp-server',
  ]) {
    const outputs = inputs(name)
      .depsOutputs.filter((input) => input.transitive)
      .map((input) => input.dependentTasksOutputFiles);
    assert.deepEqual(covered(consumed, outputs), consumed, name);
    if (name !== 'dialtone-query-core')
      assert.deepEqual(
        covered(
          ['packages/dialtone-query-core/build/tools/components.js'],
          outputs,
        ),
        ['packages/dialtone-query-core/build/tools/components.js'],
        name,
      );
  }
});
