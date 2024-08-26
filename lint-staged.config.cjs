module.exports = {
  '*.{js, mjs, cjs, vue}': [
    'pnpm exec eslint --fix --max-warnings=0 --no-warn-ignored',
  ],
  '*.less': [
    'pnpm exec stylelint --fix',
  ],
  '*.{md, mdx}': [
    'pnpm exec markdownlint',
  ],
};
