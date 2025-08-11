const baseConfig = require('../../.lintstagedrc.js');

module.exports = {
  ...baseConfig,
  '*.less': [
    'stylelint --fix --allow-empty-input',
  ],
};
