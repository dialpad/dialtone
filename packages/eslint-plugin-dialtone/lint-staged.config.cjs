module.exports = {
  '*.js': [
    'pnpm run lint-staged:code',
  ],
  '*.md': [
    'pnpm run lint-staged:docs',
  ],
};
