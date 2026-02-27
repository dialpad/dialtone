const baseConfig = require('../../.lintstagedrc.js');
const path = require('path');

const fixLogicalProperties = path.resolve(__dirname, '../stylelint-plugin-dialtone/bin/fix-logical-properties.js');

module.exports = {
  ...baseConfig,
  '*.less': [
    `node ${fixLogicalProperties}`,
    'stylelint --fix --allow-empty-input',
  ],
};
