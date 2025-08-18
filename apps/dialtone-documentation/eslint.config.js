import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueAccessibility from 'eslint-plugin-vuejs-accessibility';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...vue.configs['flat/base'],
  ...vue.configs['flat/recommended'],
  ...vueAccessibility.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        __VUEPRESS_SSR__: 'readonly',
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
      'vue/comma-dangle': ['error', 'always-multiline'],
      'vue/component-name-in-template-casing': ['error', 'kebab-case', {
        registeredComponentsOnly: true,
      }],
      'vuejs-accessibility/label-has-for': [
        'error',
        {
          required: {
            some: ['nesting', 'id'],
          },
          allowChildren: true,
        },
      ],
      'vue/new-line-between-multi-line-property': ['warn'],
      'vue/html-comment-content-spacing': ['warn'],
      'vue/no-potential-component-option-typo': ['warn'],
      'vue/multi-word-component-names': ['off'],
      'vue/no-reserved-component-names': ['error', {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      }],
      'vue/padding-line-between-blocks': ['warn'],
      'vue/require-direct-export': ['warn'],
      'vue/require-name-property': ['error'],
      'vue/valid-next-tick': ['error'],
      'vue/block-tag-newline': ['error'],
      'vue/no-duplicate-attr-inheritance': ['error'],
      'vue/no-undef-components': ['error', {
        ignorePatterns: ['icon-', 'router-link', 'toc', 'dtc-', 'dt-', 'svg-loader'],
      }],
      'vue/v-on-event-hyphenation': ['error'],
      'vue/no-template-target-blank': ['error'],
      'vue/no-static-inline-styles': ['off'],
      'vuejs-accessibility/iframe-has-title': 'warn',
      'vuejs-accessibility/aria-props': 'warn',
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      complexity: ['warn', 8],
      // Vue core extensions
      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/arrow-spacing': ['error', { before: true, after: true }],
      'vue/block-spacing': ['error', 'always'],
      'vue/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'vue/camelcase': ['error', {
        properties: 'never', // Ignore snake_case in JSON properties, which are often params.
        allow: ['^opt_'], // Allow opt_varname arguments.
      }],
      'vue/comma-spacing': ['error', { before: false, after: true }],
      'vue/comma-style': ['error', 'last'],
      'vue/dot-location': ['error', 'property'],
      'vue/dot-notation': ['error', { allowKeywords: true }],
      'vue/eqeqeq': ['error', 'always', { null: 'ignore' }],
      'vue/func-call-spacing': ['error', 'never'],
      'vue/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'vue/keyword-spacing': ['error', { before: true, after: true }],
      'vue/no-constant-condition': ['error', { checkLoops: false }],
      'vue/no-empty-pattern': 'error',
      'vue/no-extra-parens': ['error', 'functions'],
      'vue/no-irregular-whitespace': 'error',
      'vue/no-sparse-arrays': 'error',
      'vue/object-curly-newline': ['error', { multiline: true, consistent: true }],
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
      'vue/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }],
      'vue/prefer-template': ['error'],
      'vue/space-in-parens': ['error', 'never'],
      'vue/space-infix-ops': 'error',
      'vue/space-unary-ops': ['error', { words: true, nonwords: false }],
      'vue/template-curly-spacing': ['error', 'never'],
      'vue/no-v-html': 'off',
      'vue/max-attributes-per-line': ['warn', {
        singleline: {
          max: 8,
        },
        multiline: {
          max: 1,
        },
      }],
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
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
      '!docs/.vuepress',
      'docs/.vuepress/.cache',
      'docs/.vuepress/.temp',
      'docs/.vuepress/dist',
    ],
  },
];
