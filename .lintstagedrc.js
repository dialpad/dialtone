const path = require('path');

const fixLogicalProperties = path.resolve(__dirname, 'packages/stylelint-plugin-dialtone/bin/fix-logical-properties.js');

module.exports = {
  '*.{js,mjs,cjs}': [
    'eslint --fix',
  ],
  '*.json': [
    'eslint --fix',
  ],
  '*.{less,css}': [
    `node ${fixLogicalProperties}`,
  ],
  '*.{vue,md,html}': [
    `node ${fixLogicalProperties}`,
  ],
};
