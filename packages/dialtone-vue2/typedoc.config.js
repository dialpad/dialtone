// You can see all available options here https://typedoc.org/guides/options/ or via `npx typedoc --help`

export default {
  entryPoints: ['common/*.js'],

  // Non public modules should be added here.
  exclude: ['**/*.test.js', 'common/storybook_utils.js', 'common/custom-emoji-test.js', 'common/mixins'],
  out: 'functions/generated',
  githubPages: false,
  name: 'Date and Time',
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  entryPointStrategy: 'expand',
};
