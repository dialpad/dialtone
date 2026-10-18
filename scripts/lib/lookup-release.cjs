// Git pathspecs for the sources consumed by both lookup bundles.
// Source-family matches are conservative; tests and unrelated packages stay out.
const commitPaths = [
  'packages/dialtone-query-core',
  'packages/dialtone-vue',
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
  ':(glob)apps/dialtone-documentation/docs/**/*.md',
  'apps/dialtone-documentation/docs/.vuepress/site-reference.js',
  'apps/dialtone-documentation/scripts/lib/frontmatter.mjs',
  'apps/dialtone-documentation/scripts/lib/source-page.mjs',
  'scripts/build-dialtone-vue-docs.mjs',
  'scripts/generate-migration-guidance.mjs',
  'scripts/lib/component-name.mjs',
  'scripts/lib/vue-component-identity.mjs',
  'scripts/lib/lookup-release.cjs',
  'common/utils/server.mjs',
  ':(exclude,glob)**/tests/**',
  ':(exclude,glob)**/__tests__/**',
  ':(exclude,glob)**/__fixtures__/**',
  ':(exclude,glob)**/*.test.*',
  ':(exclude,glob)**/*.spec.*',
];

// Release commits can quote breaking notes, so no bump rule may match them.
const releaseRules = [
  { type: 'chore', scope: 'release', release: false },
  { type: '!chore', breaking: true, release: 'major' },
  { type: 'chore', scope: '!release', breaking: true, release: 'major' },
  { type: 'chore', scope: null, breaking: true, release: 'major' },
  { type: '@(build|ci|docs|refactor|style)', release: 'patch' },
  { type: 'chore', scope: '!release', release: 'patch' },
  { type: 'chore', scope: null, release: 'patch' },
];

module.exports = { commitPaths, releaseRules };
