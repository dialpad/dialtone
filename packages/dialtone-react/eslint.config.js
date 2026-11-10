// ESLint for dialtone-react: TypeScript (typescript-eslint, without type information, to stay fast) and the Rules
// of Hooks, plus the repo's style rules (the root and dialtone-vue configs), copied rather than imported so this
// package doesn't depend on either. The JS harness (parity/, compare/, scripts/) gets the same style rules.
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'index.ts', 'icons/generated/', 'compare/generated/', 'storybook-static/'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      'no-console': ['warn', { allow: ['error', 'info', 'warn'] }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // The Rules of Hooks, plus the React Compiler checks that hold for any React code. The compiler's
      // `immutability`, `refs` and `set-state-in-effect` are off: the conventions prescribe patterns they reject
      // (a container element in state whose attributes a layout effect syncs; measuring in a layout effect and
      // setting state, where Vue used nextTick), and this package doesn't use the compiler. `purity` is off because
      // ports reproduce Vue's render-time Math.random (avatar colours).
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/static-components': 'error',
      'react-hooks/use-memo': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/error-boundaries': 'error',
      // `_`-prefixed names are deliberately unused (a destructured prop kept out of a rest spread).
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    // Ports can't switch lint off (parity.md › Anti-gaming). The gate also fails a unit with an inline directive;
    // this makes any spelling it misses inert.
    files: ['components/**'],
    linterOptions: { noInlineConfig: true },
  },
  {
    // Node scripts: the harness, the comparison generator and the build scripts print to the console by design.
    files: ['**/*.{js,mjs,cjs}', 'parity/**', 'compare/*.mjs', 'scripts/**'],
    rules: { 'no-console': 'off' },
  },
);
