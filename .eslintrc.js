module.exports = {
  extends: [
    'standard',
    'semistandard',
    'plugin:vue/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
  ],
  env: {
    browser: true,
    node: true,
    amd: true,
  },
  rules: {
    camelcase: ['error', {
      properties: 'never', // Ignore snake_case in JSON properties, which are often params.
      allow: ['^opt_'], // Allow opt_varname arguments.
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-promise-reject-errors': ['error', {
      allowEmptyReject: true,
    }],
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: true,
    }],

    // TODO remove these as the errors are fixed.
    'vuejs-accessibility/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
        allowChildren: true,
      },
    ],
    'vue/no-deprecated-destroyed-lifecycle': 'warn',
    'vue/no-deprecated-dollar-listeners-api': 'warn',
    'vue/no-deprecated-v-bind-sync': 'warn',
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    complexity: ['warn', 5],
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      plugins: [
        'mocha',
      ],
      extends: [
        'plugin:mocha/recommended',
      ],
      env: {
        browser: true,
        node: true,
        mocha: true,
      },
      rules: {
        'max-lines': 'off',
        // disabled to allow the use of shared example closures
        'mocha/no-setup-in-describe': 'off',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-hooks-for-single-case': 'off',
      },
    },
  ],
};
