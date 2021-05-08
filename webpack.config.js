const path = require("path");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
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
        plugins: [new TsconfigPathsPlugin()],
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
};
