module.exports = {
  '*.{js, mjs, cjs, vue}': [
    'pnpm exec eslint --fix',
    'pnpm exec prettier --write --ignore-unknown',
  ],
  '*.json': [
    'pnpm exec prettier --write --ignore-unknown',
  ],
  '*.less': [
    'pnpm exec stylelint --fix',
    'pnpm exec prettier --write --ignore-unknown',
  ],
  '*.{md, mdx}': [
    'pnpm exec markdownlint',
    'pnpm exec prettier --write --ignore-unknown',
  ],
};
