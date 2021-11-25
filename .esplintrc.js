module.exports = {
  surfaceArea: ['.'],
  eslint: {
    extensions: ['.js', '.vue'],
  },
  rules: [
    'vue/no-deprecated-dollar-listeners-api',
    'vue/no-deprecated-destroyed-lifecycle',
    'vue/no-deprecated-v-bind-sync',
    'complexity',
    'vuejs-accessibility/iframe-has-title',
    'max-lines'
  ],
};
