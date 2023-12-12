module.exports = {
  '*.{js, mjs, cjs, vue}': [
    'eslint --fix',
  ],
  '*.less': [
    'stylelint --fix'
  ],
  '*.{md, mdx}': [
    'markdownlint'
  ]
};
