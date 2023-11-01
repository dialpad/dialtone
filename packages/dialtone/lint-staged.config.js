module.exports = {
  '*.{js, vue}': [
    'npm run lint-staged:code',
  ],
  '*.{less, css}': [
    'npm run lint-staged:library',
  ],
};
