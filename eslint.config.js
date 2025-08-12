import js from '@eslint/js';
import json from 'eslint-plugin-json';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    plugins: {
      json,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      camelcase: ['error', {
        properties: 'never', // Ignore snake_case in JSON properties, which are often params.
        allow: ['^opt_'], // Allow opt_varname arguments.
      }],
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'prefer-promise-reject-errors': ['error', {
        allowEmptyReject: true,
      }],
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      complexity: ['warn', 5],
    },
  },
  {
    files: ['**/*.json'],
    plugins: {
      json,
    },
    processor: 'json/json',
    rules: {
      'json/*': 'error',
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '**/common/emoji/index.js',
      'packages/dialtone-vue2/index.js',
      'packages/dialtone-vue3/index.js',
      '**/common/storybook_utils.js',
      '**/components/emoji/emoji.test.js',
      '**/components/emoji_text_wrapper/emoji_text_wrapper.test.js',
      '**/components/icon/icon_constants.js',
      '**/components/illustration/illustration_constants.js',
      'packages/language-server/sample/*',
    ],
  },
];
