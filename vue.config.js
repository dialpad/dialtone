const path = require('path');
module.exports = {
  lintOnSave: false,
  css: { extract: false },
  chainWebpack: config => {
    config.externals({ '@dialpad/dialtone': '@dialpad/dialtone' });
    config.optimization.splitChunks(false);
    config.output
      .filename('dialtone-vue.[name].js');

    config.entryPoints.delete('app');
    config.entry('main').add('./index.js').end();
    config.entry('emoji').add('./emoji.js').end();
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
