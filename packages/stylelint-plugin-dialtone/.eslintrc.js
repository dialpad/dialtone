'use strict';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: 'vue-eslint-parser',
  },
  env: {
    node: true,
  },
  rules: {
    'node/no-missing-import': ['warn'],
  },
};
