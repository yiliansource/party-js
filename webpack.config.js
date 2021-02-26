const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        'party': './src/index.ts',
        'party.min': './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'party',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: (process.env.NODE_ENV || 'development') == 'development' ? 'inline-source-map' : 'none',
    plugins: [
        new TerserWebpackPlugin({
            test: /\.min\.js$/
        })
    ]
}