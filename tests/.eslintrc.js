module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
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
