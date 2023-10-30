module.exports = {
  ignoreFiles: [
    '**/node_modules',
    '**/dist/**/*',
    'docs/.vuepress/**/*',
    'docs/assets/css/**/*',
    'docs/assets/fonts/**/*',
    '**/*.js',
    '**/*.vue',
    '**/*.md',
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-recommended-less',
  ],
  plugins: [
    'stylelint-less',
    'stylelint-no-px',
  ],
  customSyntax: 'postcss-less',
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['/^ff-/'],
      },
    ],
    'media-feature-range-notation': null,
    'property-no-unknown': null,
    'function-no-unknown': null,
    'import-notation': null,
    'no-extra-semicolons': null,

    'no-descending-specificity': null, // turn off for now, descending cases could be fixed on the last refactoring
    'function-calc-no-unspaced-operator': null, // otherwise it will be an error during build
    'alpha-value-notation': 'number',

    // override stylelint-config-standard rules
    'color-function-notation': null,
    'custom-media-pattern': null,
    'custom-property-pattern': null,
    'media-feature-name-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'selector-no-vendor-prefix': null,
    'value-keyword-case': null,
    'value-no-vendor-prefix': null,
    indentation: null,
    'length-zero-no-unit': true,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['/grid/'],
      },
    ],
    'less/color-no-invalid-hex': null,
    'less/no-duplicate-variables': null,
    'meowtec/no-px': [
      true,
      {
        message: 'Use dialtone variables such as line-height: var(--lh-200) or width: var(--size-600) or' +
        'padding: var(--space-400) rather than directly setting px. See the lib/build/less/variables folder.',
      },
    ],
  },
};
