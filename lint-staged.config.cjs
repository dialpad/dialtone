module.exports = {
  '*.{js, mjs, cjs, vue}': [
    'pnpm exec eslint --fix',
  ],
  '*.less': [
    'pnpm exec stylelint --fix'
  ],
  '*.{md, mdx}': [
    'pnpm exec markdownlint'
  ]
};
