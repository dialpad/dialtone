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
      complexity: ['warn', 8],
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
    // Flat config resolves to a single nearest-to-CWD file, not a merge of
    // nested configs — packages/figma-components-sync/eslint.config.js only
    // governs a direct `pnpm lint`/`nx run figma-components-sync:lint` (CWD =
    // that package), never a repo-root invocation like the pre-commit hook's
    // lint-staged run, which lands here instead. Mirrors that package's own
    // config (see it for the full reasoning): browser/figma globals this
    // ported, uncommitted-until-now pipeline needs, and relaxed severities for
    // code that's proven working but wasn't authored against this lint bar.
    files: ['packages/figma-components-sync/sync-scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        figma: 'readonly',
        __html__: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      quotes: 'off',
      'max-len': 'off',
      camelcase: 'off',
      'comma-dangle': 'off',
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '**/common/emoji/index.js',
      'packages/dialtone-vue/index.js',
      '**/common/storybook_utils.js',
      '**/components/emoji/emoji.test.js',
      '**/components/emoji_text_wrapper/emoji_text_wrapper.test.js',
      '**/components/icon/icon_constants.js',
      '**/components/illustration/illustration_constants.js',
      'packages/language-server/sample/*',
      'packages/figma-components-sync/sync-scripts/generic-builder.js',
      'packages/figma-components-sync/sync-scripts/icon-builder.js',
      'packages/figma-components-sync/sync-scripts/slot-properties.js',
      'packages/figma-components-sync/sync-scripts/figma-plugin/code.js',
      'packages/figma-components-sync/sync-scripts/superseded/**',
    ],
  },
];
