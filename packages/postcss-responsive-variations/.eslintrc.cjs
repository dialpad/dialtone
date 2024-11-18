module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'jest/expect-expect': 'off',
  },
};
