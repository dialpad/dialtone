module.exports = {
  '*.{js, vue}': [
    'npm run lint-staged:code',
  ],
  '*.md': [
    'npm run lint-staged:docs',
  ],
  '*.{less, css}': [
    'npm run lint-staged:library',
  ],
};
