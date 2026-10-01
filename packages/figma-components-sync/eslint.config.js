import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
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
    // `sync-scripts/` (minus the plugin-sandbox fragments and figma-plugin/code.js,
    // both excluded below) is ported verbatim from a working, 51/51-checks-passing
    // pipeline (see its own README's provenance section) — not rewritten to this
    // package's lint bar. Rewriting logic this proven to satisfy quotes/max-len/
    // no-unused-vars, without a live Figma session to re-verify against, trades a
    // cosmetic pass for a real risk of silently breaking something a four-check
    // verification suite exists specifically to catch. Relaxed here, not removed —
    // fix opportunistically when a file is touched for an actual change.
    files: ['sync-scripts/**/*.{js,mjs}'],
    rules: {
      'no-unused-vars': 'warn',
      quotes: 'off',
      'max-len': 'off',
      camelcase: 'off',
      'comma-dangle': 'off',
    },
  },
  {
    // generic-builder.js/icon-builder.js/slot-properties.js get inlined by
    // build-plugin.mjs into the real plugin's code.js, run inside Figma's
    // plugin sandbox (not Node or a browser — `figma`/`__html__` are runtime
    // globals ESLint can't see), and aren't standalone-valid modules on their
    // own (each is a fragment assembled into a function body, so e.g. a
    // top-level `return` is intentional, not a bug) — not linted at all.
    ignores: [
      'sync-scripts/generic-builder.js',
      'sync-scripts/icon-builder.js',
      'sync-scripts/slot-properties.js',
      'sync-scripts/figma-plugin/code.js',
      'sync-scripts/superseded/**',
    ],
  },
];
