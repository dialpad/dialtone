const {defineConfig} = require('@vue/cli-service')
const {resolve} = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: resolve(__dirname, 'src/svg'),
                        to: resolve(__dirname, 'dist/svg'),
                        toType: 'dir',
                    },
                ],
            }),
        ],
    },
})
