import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import jsdoc from 'eslint-plugin-jsdoc';
import vueAccessibility from 'eslint-plugin-vuejs-accessibility';
import mocha from 'eslint-plugin-mocha';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...vue.configs['flat/base'],
  ...vue.configs['flat/recommended'],
  ...vueAccessibility.configs['flat/recommended'],
  {
    plugins: {
      jsdoc,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
      }],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'import/no-named-default': 0,
      'vue/comma-dangle': ['error', 'always-multiline'],
      'vue/comma-spacing': ['error', { before: false, after: true }],
      'vue/comma-style': ['error', 'last'],
      'vue/no-v-for-template-key': 0,
      'vue/no-v-html': 0,
      'vue/no-v-model-argument': 0,
      'jsdoc/require-jsdoc': 0,
      'jsdoc/no-undefined-types': 0,
      'jsdoc/require-hyphen-before-param-description': 1,
    },
  },
  {
    files: ['**/*.test.js', 'src/lib/test/*.js'],
    plugins: {
      mocha,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      ...mocha.configs.recommended.rules,
      'max-lines': 'off',
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-hooks-for-single-case': 'off',
      'mocha/no-exports': 0,
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
    ],
  },
];
