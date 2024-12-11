module.exports = {
  '*.{js,mjs,cjs,vue}': [
    'eslint --fix',
    'vitest related --run',
  ],
  // using function syntax here so we can run the command without lint staged automatically passing filenames to it.
  '**/dialtone-icons/src/keywords-*.json': (filenames) => 'nx run dialtone-icons:build --skip-nx-cache',
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
