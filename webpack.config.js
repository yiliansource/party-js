const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'none',
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
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'source-map',
    plugins: [
        new TerserWebpackPlugin({
            test: /\.min\.js$/
        })
    ]
}