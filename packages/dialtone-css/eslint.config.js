import js from '@eslint/js';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
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
      complexity: ['warn', 8],
    },
  },
  {
    files: ['**/*.test.js', '**/*.test.cjs', '**/*.spec.js'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Basic Jest rules
      'jest/expect-expect': 'off',
    },
  },
  {
    ignores: [
      'node_modules',
      'lib/dist',
    ],
  },
];
