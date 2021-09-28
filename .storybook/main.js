const path = require('path');
const less = require('less');
const package = require('../package.json');
const generate = require('generate-file-webpack-plugin');

const cssLoaders = [
  'style-loader',
  { loader: 'css-loader', options: { sourceMap: true }},
];

const lessLoaders = [
  ...cssLoaders,
  {
    loader: 'less-loader',
    options: {
      implementation: less,
      lessOptions: {
        rewriteUrls: 'off',
        sourceMap: true,
      },
    },
  },
];

module.exports = {
  webpackFinal: async (config) => {
    config.plugins.push(generate({
      file: 'version.txt',
      content: package.version
    }));

    config.module.rules.push({
      test: /\.less$/,
      use: lessLoaders,
    });

    config.module.rules.push({
      test: /\.css$/,
      use: cssLoaders,
    });

    config.module.rules.push({
      test: /\.(stories|story)\.[tj]sx?$/,
      loader: require.resolve('@storybook/source-loader'),
      exclude: [/node_modules/],
      enforce: 'pre',
    });

    config.output = {
      ...config.output,
      filename: 'preview.[name].js',
    };

    config.devtool = 'source-map'

    return config;
  },

  managerWebpack: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.less$/,
      use: lessLoaders,
    });

    config.module.rules.push({
      test: /\.css$/,
      use: cssLoaders,
    });

    config.output = {
      ...config.output,
      filename: 'manager.[name].js',
    };

    return config;
  },

  stories: [
    '../components/**/*.stories.@(js|mdx)',
    '../docs/**/*.stories.@(js|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
};
