import js from '@eslint/js';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended-script'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'n/no-missing-import': ['warn'],
    },
  },
];
