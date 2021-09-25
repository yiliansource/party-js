const path = require("path");

const TerserWebpackPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
    mode: mode,
    entry: {
        party: "./src/index.ts",
        "party.min": "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "bundle"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "party",
        umdNamedDefine: true,
        libraryExport: "default",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    devtool: mode == "development" ? "source-map" : "none",
    plugins: [
        new TerserWebpackPlugin({
            test: /\.min\.js$/,
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        }),
    ],
    stats: "errors-only",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "samples"),
            watch: true,
        },
        watchFiles: ["src/**/*.ts"],
        magicHtml: true,
        compress: true,
        port: 9000,
    },
};
