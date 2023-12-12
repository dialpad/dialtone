module.exports = {
  '*.less': [
    'pnpm exec stylelint --fix',
    'pnpm exec lesshint'
  ]
};
