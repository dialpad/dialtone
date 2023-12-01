module.exports = {
  '*.{js,vue}': [
    'pnpm run lint-staged:code',
  ],
  '*.mdx': [
    'pnpm run lint-staged:docs',
  ],
};
