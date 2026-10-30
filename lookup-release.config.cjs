// CommonJS supports the synchronous release configs and semantic-release-plus plugin loader.
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');

const releaseRequire = createRequire(require.resolve('semantic-release-plus/package.json'));
const commitAnalyzer = releaseRequire('@semantic-release/commit-analyzer');
const notesGenerator = releaseRequire('@semantic-release/release-notes-generator');

const testPaths = [
  ':(exclude,glob)**/tests/**',
  ':(exclude,glob)**/__tests__/**',
  ':(exclude,glob)**/__fixtures__/**',
  ':(exclude,glob)**/*.test.*',
  ':(exclude,glob)**/*.spec.*',
  ':(exclude)packages/dialtone-mcp-server/test-search.js',
];

// Git pathspecs for the sources consumed by both lookup bundles.
// Source-family matches are conservative; tests and unrelated packages stay out.
// When a bundled dataset gains a producer, add it here and to the release-path suite.
const commitPaths = [
  'packages/dialtone-query-core',
  'packages/dialtone-vue',
  'packages/combinator',
  'packages/dialtone-css/lib/build/less',
  'packages/dialtone-css/lib/build/js/dialtone_migration_helper/configs',
  'packages/dialtone-css/postcss',
  'packages/dialtone-css/gulpfile.cjs',
  'packages/dialtone-css/package.json',
  'packages/dialtone-css/project.json',
  'packages/dialtone-tokens',
  'packages/dialtone-icons/src/svg/icons',
  'packages/dialtone-icons/src/keywords-icons.json',
  'packages/dialtone-icons/gulpfile.cjs',
  'packages/dialtone-icons/transformSVGtoVue.cjs',
  'packages/dialtone-icons/package.json',
  'packages/dialtone-icons/project.json',
  'packages/dialtone-docs/src/generators',
  'packages/dialtone-docs/src/utils',
  'packages/dialtone-docs/package.json',
  'packages/dialtone-docs/project.json',
  'apps/dialtone-documentation/package.json',
  ':(glob)apps/dialtone-documentation/docs/**/*.md',
  'apps/dialtone-documentation/docs/.vuepress/site-reference.js',
  'apps/dialtone-documentation/docs/.vuepress/plugins/fenced-demo-shared.js',
  'scripts/retrieval/profiles.mjs',
  'scripts/retrieval/example-consumer.mjs',
  'apps/dialtone-documentation/scripts/lib/frontmatter.mjs',
  'apps/dialtone-documentation/scripts/lib/source-page.mjs',
  'scripts/build-dialtone-vue-docs.mjs',
  'scripts/generate-migration-guidance.mjs',
  'scripts/lib',
  'common/utils/server.mjs',
  'lookup-release.config.cjs',
  ...testPaths,
];

// A producer's breaking change refreshes data; tool/shared-core changes retain major semantics.
const releaseRules = [
  { breaking: true, lookupContract: true, release: 'major' },
  { breaking: true, lookupContract: false, release: 'patch' },
  { type: '@(build|chore|ci|docs|refactor|style)', release: 'patch' },
];

function lookupCommits({ adapterRoot }, { cwd, env, commits }) {
  return commits
    // Filter bookkeeping from both analysis and notes: release rules alone cannot do the latter.
    .filter(({ message }) => !/^chore\(release\):/.test(message))
    .map(commit => ({
      ...commit,
      lookupContract: execFileSync('git', [
        'diff-tree', '--root', '--no-commit-id', '--name-only', '-r', '-m', '--first-parent',
        '--no-renames', commit.hash, '--', adapterRoot, 'packages/dialtone-query-core',
        'scripts/lib/component-name.mjs', ...testPaths,
      ], { cwd, env, encoding: 'utf8' }).trim().length > 0,
    }));
}

async function analyzeCommits(options, context) {
  return commitAnalyzer.analyzeCommits({ preset: 'angular', releaseRules }, {
    ...context, commits: lookupCommits(options, context),
  });
}

async function generateNotes(options, context) {
  const { writerOpts } = await releaseRequire('@dialpad/conventional-changelog-angular');
  return notesGenerator.generateNotes({
    config: '@dialpad/conventional-changelog-angular',
    writerOpts: {
      transform(commit, writerContext) {
        const formatted = writerOpts.transform(commit, writerContext);
        if (formatted && !commit.lookupContract)
          for (const note of formatted.notes) note.title = 'Bundled Dialtone data changes';
        return formatted;
      },
    },
  }, { ...context, commits: lookupCommits(options, context) });
}

module.exports = { commitPaths, analyzeCommits, generateNotes };
