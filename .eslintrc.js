module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": "error",
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
};
