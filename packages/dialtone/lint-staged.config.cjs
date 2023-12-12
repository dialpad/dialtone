module.exports = {
  '*.{js, cjs, vue}': [
    'pnpm eslint --fix',
  ],
  '*.less': [
    'pnpm stylelint --fix'
  ]
};
