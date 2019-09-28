
var webpack = require('webpack');
const path = require('path'); // 导入路径包

module.exports = function (task, isProduction) {
    return {
        entry: task.src,
        output: {
            filename: task.file,
            path: path.resolve(task.build)
        },
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
            alias: {
                'vue': 'vue/dist/vue.esm.js'
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: 'awesome-typescript-loader?transpileOnly=false'
                },
                {
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.(html)$/,
                    loader: 'html-loader',
                },
                {
                    test: /\.(jade)$/,
                    loader: 'jade-loader',
                }
            ]
        },
        devtool: isProduction?"":"source-map",
        plugins: isProduction?[
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify("production"),
                },
            }),
        ]:[]
    }
}