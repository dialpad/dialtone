module.exports = {
  '*.js': [
    'pnpm eslint --fix',
  ],
  '*.md': [
    'pnpm markdownlint',
  ],
};
