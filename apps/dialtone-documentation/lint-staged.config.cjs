module.exports = {
  '*.{js, vue}': [
    'pnpm run lint-staged:code',
  ],
  '*.md': [
    'pnpm run lint-staged:docs',
  ],
};
