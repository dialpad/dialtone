const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '.'),
      },
    },
    externals: [
      '@dialpad/dialtone',
    ],
    externalsType: 'commonjs',
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
});
