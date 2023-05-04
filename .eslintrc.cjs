module.exports = {
  extends: ['standard', 'semistandard', 'plugin:vue/vue3-recommended', 'plugin:vuejs-accessibility/recommended', 'plugin:storybook/recommended'],
  env: {
    browser: true,
    node: true,
    es2022: true,
    amd: true
  },
  rules: {
    camelcase: ['error', {
      properties: 'never',
      // Ignore snake_case in JSON properties, which are often params.
      allow: ['^opt_'] // Allow opt_varname arguments.
    }],

    'comma-dangle': ['error', 'always-multiline'],
    'no-console': ['warn', {
      allow: ['error', 'info']
    }],
    'max-len': ['error', {
      code: 120,
      tabWidth: 2
    }],
    'prefer-promise-reject-errors': ['error', {
      allowEmptyReject: true
    }],
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: true
    }],
    // TODO remove these as the errors are fixed.
    'vuejs-accessibility/label-has-for': ['error', {
      required: {
        some: ['nesting', 'id']
      },
    }],
    'vue/no-deprecated-destroyed-lifecycle': 'warn',
    'vue/no-deprecated-dollar-listeners-api': 'warn',
    'vue/no-deprecated-v-bind-sync': 'warn',
    'vue/new-line-between-multi-line-property': ['warn'],
    'vue/html-comment-content-spacing': ['warn'],
    'vue/no-potential-component-option-typo': ['warn'],
    'vue/no-reserved-component-names': ['error', {
      disallowVueBuiltInComponents: true,
      disallowVue3BuiltInComponents: true
    }],
    'vue/no-v-model-argument': ['warn'],
    'vue/padding-line-between-blocks': ['warn'],
    'vue/require-direct-export': ['warn'],
    'vue/require-name-property': ['error'],
    'vue/valid-next-tick': ['error'],
    'vue/block-tag-newline': ['error'],
    'vue/no-duplicate-attr-inheritance': ['error'],
    'vue/no-bare-strings-in-template': ['error'],
    'vue/no-undef-components': ['error'],
    'vue/no-unused-properties': ['warn'],
    'vue/v-on-event-hyphenation': ['error'],
    'vue/no-template-target-blank': ['error'],
    'vue/no-static-inline-styles': ['error'],
    'vuejs-accessibility/iframe-has-title': 'warn',
    'vuejs-accessibility/aria-props': 'warn',
    'max-lines': ['warn', {
      max: 300,
      skipBlankLines: true,
      skipComments: true
    }],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true
    }],
    complexity: ['warn', 5],
    //             Vue core extensions
    // these all match regular non-vue ESLint rules,
    // but makes them apply to js within the vue template.
    'vue/array-bracket-spacing': ['error', 'never'],
    'vue/arrow-spacing': ['error', {
      before: true,
      after: true
    }],
    'vue/block-spacing': ['error', 'always'],
    'vue/brace-style': ['error', '1tbs', {
      allowSingleLine: true
    }],
    'vue/camelcase': ['error', {
      properties: 'never',
      // Ignore snake_case in JSON properties, which are often params.
      allow: ['^opt_'] // Allow opt_varname arguments.
    }],

    'vue/comma-spacing': ['error', {
      before: false,
      after: true
    }],
    'vue/comma-style': ['error', 'last'],
    'vue/dot-location': ['error', 'property'],
    'vue/dot-notation': ['error', {
      allowKeywords: true
    }],
    'vue/eqeqeq': ['error', 'always', {
      null: 'ignore'
    }],
    'vue/func-call-spacing': ['error', 'never'],
    'vue/key-spacing': ['error', {
      beforeColon: false,
      afterColon: true
    }],
    'vue/keyword-spacing': ['error', {
      before: true,
      after: true
    }],
    'vue/no-constant-condition': ['error', {
      checkLoops: false
    }],
    'vue/no-empty-pattern': 'error',
    'vue/no-extra-parens': ['error', 'functions'],
    'vue/no-irregular-whitespace': 'error',
    'vue/no-sparse-arrays': 'error',
    'vue/object-curly-newline': ['error', {
      multiline: true,
      consistent: true
    }],
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/object-property-newline': ['error', {
      allowMultiplePropertiesPerLine: true
    }],
    'vue/operator-linebreak': ['error', 'after', {
      overrides: {
        '?': 'before',
        ':': 'before',
        '|>': 'before'
      }
    }],
    'vue/prefer-template': ['error'],
    'vue/space-in-parens': ['error', 'never'],
    'vue/space-infix-ops': 'error',
    'vue/space-unary-ops': ['error', {
      words: true,
      nonwords: false
    }],
    'vue/template-curly-spacing': ['error', 'never']
  },
  overrides: [
    {
      files: [
        '**/*.test.js',
        'tests/shared_examples/*.js',
        'tests/setupTests.js',
      ],
      plugins: ['jest'],
      env: {
        browser: true,
        node: true,
        jest: true,
      },
      rules: {
        'max-lines': 'off',
        'no-console': 'off',
      },
    },
    {
      files: [
        '**/*.story.vue',
      ],
      rules: {
        'vue/no-bare-strings-in-template': [
          'off',
        ],
      },
    },
  ],
};
