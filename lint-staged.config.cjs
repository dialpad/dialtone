module.exports = {
  '*.{js,mjs,cjs,vue}': [
    'eslint --fix',
  ],
  'packages/dialtone-vue2/**/*.{js,mjs,cjs,vue}': [
    'cd packages/dialtone-vue2 && vitest related --run --no-coverage',
  ],
  'packages/dialtone-vue3/**/*.{js,mjs,cjs,vue}': [
    'cd packages/dialtone-vue3 && vitest related --run --no-coverage',
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
