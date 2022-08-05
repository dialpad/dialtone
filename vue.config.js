const path = require('path');
module.exports = {
  lintOnSave: false,
  css: { extract: false },
  chainWebpack: config => {
    config.externals({ '@dialpad/dialtone': '@dialpad/dialtone' });
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '.'),
      },
    },
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};
