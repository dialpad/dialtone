module.exports = {
  '*.{js,vue}': [
    'npm run lint-staged:code',
    'esplint --stage-record-file',
  ],
  '*.mdx': [
    'npm run lint-staged:docs',
  ],
};
