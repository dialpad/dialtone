module.exports = {
  '*.{js, vue}': [
    'pnpm eslint --fix',
  ],
  '*.md': [
    'pnpm markdownlint',
  ],
};
