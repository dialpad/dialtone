const { ESLint } = require('eslint');

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    }),
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};

module.exports = {
  '**/*.{js, mjs, cjs, vue}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    return [
      `pnpm exec eslint --fix --max-warnings=0 ${filesToLint}`,
    ];
  },
  '*.less': [
    'pnpm exec stylelint --fix',
  ],
  '*.{md, mdx}': [
    'pnpm exec markdownlint',
  ],
};
