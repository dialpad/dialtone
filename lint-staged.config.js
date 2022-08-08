module.exports = {
  '*.{js,vue}': [
    'npm run lint-staged:code',
  ],
  '*.mdx': [
    'npm run lint-staged:docs',
  ],
};
