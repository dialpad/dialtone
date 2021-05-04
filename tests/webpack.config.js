const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (_env, _argv) => {
  return {
    mode: 'development',
    target: 'node',
    context: path.resolve(__dirname),

    entry: './main.js',

    output: {
      path: path.resolve(__dirname, 'compiled'),
      filename: 'main.js',
    },

    node: {
      global: true,
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
            options: {
              productionMode: false,
              optimizeSSR: false,
              cacheDirectory: path.resolve(__dirname, '.cache'),
              // TODO(dbecher) figure out this whitespace discrepancy between
              // the prod build and the tests.
              compilerOptions: {
                whitespace: 'condense',
              },
            },
          },
        },
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    node: 'current',
                  },
                  useBuiltIns: 'entry',
                  corejs: 3,
                }],
              ],
              plugins: [
                'dynamic-import-node',
              ],
              // Do not treat files without import/export as ES modules.
              sourceType: 'unambiguous',
              sourceMaps: true,
              inputSourceMap: true,
              cacheDirectory: path.resolve(__dirname, '.cache/babel'),
            },
          },
        },
        {
          test: /\.(less|css|png|jpe?g|gif|svg|woff2?|ttf|eot)(\?([a-z]+)=[0-9])?(\??#([a-z]+))?$/i,
          use: ['null-loader'],
        },
        {
          test: /\.(txt)$/i,
          type: 'javascript/auto',
          use: [
            {
              loader: 'raw-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.vue'],
      alias: {},
    },

    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        JS_ENV: 'unit',
        DEBUG: false,
      }),
    ],

    optimization: {
      minimize: false,
    },

    devtool: 'cheap-module-source-map',

    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.cache'),
    },
  };
};
