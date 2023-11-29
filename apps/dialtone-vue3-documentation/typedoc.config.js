// You can see all available options here https://typedoc.org/guides/options/ or via `pnpm typedoc --help`

/** @type {import('typedoc').TypeDocOptions} */
export default {
  entryPoints: ['common/*.js'],

  // Non public modules should be added here.
  exclude: ['**/*.test.js', 'common/storybook_utils.js', 'common/custom-emoji-test.js', 'common/mixins'],
  out: 'functions/generated',
  githubPages: false,
  name: 'Date and Time',
  entryPointStrategy: 'expand',
};
