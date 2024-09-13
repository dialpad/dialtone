const path = require('path');

module.exports = {
  publicPath: './',
  lintOnSave: false,
  css: {
    extract: false,
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm-browser.js',
        '@': path.resolve(__dirname, '.'),
        'dialtone-icons': path.resolve(__dirname, 'node_modules/@dialpad/dialtone/lib/dist/vue/icons'),
      },
    },
  },
};
