const path = require('path');
module.exports = {
  lintOnSave: false,
  css: { extract: false },
  chainWebpack: config => {
    config.externals({ '@dialpad/dialtone': '@dialpad/dialtone' });
    config.resolve.alias.set('vue', '@vue/compat');

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '.'),
      },
    },
  },
};
