module.exports = {
  '*.{js,vue}': [
    'pnpm eslint --fix',
  ],
  '*.mdx': [
    'pnpm markdownlint',
  ],
};
