module.exports = {
  '*.{js,mjs,cjs,vue}': [
    'eslint --fix',
    'vitest related --run',
  ],
  '*.json': [
    'eslint --fix',
  ],
  '*.less': [
    'stylelint --fix --allow-empty-input',
  ],
  '*.{md,mdx}': [
    'markdownlint --fix',
  ],
};
