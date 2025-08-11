/* eslint-disable n/no-extraneous-import */
import js from '@eslint/js';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';

export default [
  js.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended-script'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
  },
];
