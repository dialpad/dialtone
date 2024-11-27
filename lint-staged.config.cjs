module.exports = {
  '*.{js,mjs,cjs,vue}': [
    'eslint --fix',
    'vitest related --run',
  ],
  '**/dialtone-icons/src/keywords-icons.json': (filenames) => 'nx run dialtone-icons:build --skip-nx-cache',
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
