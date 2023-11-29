module.exports = {
  '*.{js, cjs, vue}': [
    'pnpm run lint-staged:code',
  ],
  '*.{less, css}': [
    'pnpm run lint-staged:library',
  ],
};
