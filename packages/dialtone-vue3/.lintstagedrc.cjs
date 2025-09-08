const baseConfig = require('../../.lintstagedrc.js');

module.exports = {
  ...baseConfig,
  '*.{js,mjs,cjs,vue}': [
    'eslint --fix',
    'vitest related --run',
  ],
};
