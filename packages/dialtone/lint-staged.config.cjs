module.exports = {
  '*.{js, cjs, vue}': [
    'npm run lint-staged:code',
  ],
  '*.{less, css}': [
    'npm run lint-staged:library',
  ],
};
