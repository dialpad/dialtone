module.exports = {
  '*.{vue}': [
    'vitest related --run',
  ],
  '*.{vue,js,mjs,cjs,json}': [
    'eslint --fix',
  ],
  '*.less': [
    'stylelint --fix --allow-empty-input',
  ],
  '*.{md,mdx}': [
    'markdownlint --fix',
  ],
};
