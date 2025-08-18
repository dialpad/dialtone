import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      camelcase: ['error', {
        properties: 'never',
        allow: ['^opt_'],
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
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      camelcase: ['error', {
        properties: 'never',
        allow: ['^opt_'],
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
    ignores: [
      'test.*',
      'sample/*',
    ],
  },
];
