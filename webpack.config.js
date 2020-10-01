var path = require('path')
var webpack = require('webpack')

module.exports = {
    // 入口文件
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['css-loader']
        }, {
            test: /\.less$/,
            use: ['css-loader', 'less-loader']
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            use: {
                loader: 'file',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        }]
    },
    // webpack-dev-server配置
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: '#eval-source-map'
};

// 生产环境，运行npm run build则执行这里
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        // 环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // 压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}
