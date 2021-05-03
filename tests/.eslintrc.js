module.exports = {
  plugins: [
    'mocha',
  ],
  extends: [
    'plugin:mocha/recommended',
    '../.eslintrc.js',
  ],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    // disabled to allow the use of shared example closures
    'mocha/no-setup-in-describe': 'off',
    'mocha/no-exclusive-tests': 'error',
  },
  overrides: [
    {
      files: ['shared_examples/*.js'],
      rules: {
        'mocha/no-exports': 'off',
      },
    },
  ],
};
