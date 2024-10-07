"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: "vue-eslint-parser"
  },
  env: {
    node: true,
  },
};
