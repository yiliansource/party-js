module.exports = {
    env: { browser: true, es6: true },
    root: true,
    extends: ["eslint:recommended"],
    overrides: [
        {
            env: { node: true },
            files: ["*.js"],
        },
        {
            files: ["*.ts"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: ["plugin:@typescript-eslint/recommended"],
        },
    ],
};
