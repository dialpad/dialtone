module.exports = {
  '*.{js, mjs, cjs, vue}': [
    'pnpm exec eslint --fix',
  ],
  '*.less': [
    'pnpm exec stylelint --fix --allow-empty-input',
  ],
  '*.{md, mdx}': [
    'pnpm exec markdownlint',
  ],
};
