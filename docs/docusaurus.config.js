const glob = require("glob");

module.exports = {
    title: "party.js",
    tagline: "A JavaScript library to brighten up your user's site experience with visual effects!",
    url: "https://party.js.org/",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/logo.svg",
    organizationName: "yiliansource",
    projectName: "party-js",
    plugins: [
        "docusaurus-plugin-sass",
        [
            "docusaurus-plugin-typedoc",
            {
                entryPoints: glob.sync("../src/**/index.ts"),
                tsconfig: "../tsconfig.json",

                readme: "none",
                includeVersion: true,
                excludePrivate: true,
                excludeProtected: true,
                excludeInternal: true,

                sidebar: {
                    sidebarFile: null,
                },
            },
        ],
    ],
    themeConfig: {
        image: "img/banner.png",
        metadatas: [
            {
                name: "theme-color",
                content: "#FF7F6B",
            },
        ],
        colorMode: {
            respectPrefersColorScheme: true,
        },
        prism: {
            theme: require("prism-react-renderer/themes/nightOwlLight"),
            darkTheme: require("prism-react-renderer/themes/palenight"),
        },
        gtag: {
            trackingID: "G-EWQS5KE2B5",
            anonymizeIP: true,
        },
        navbar: {
            title: "party.js",
            hideOnScroll: true,
            logo: {
                alt: "party.js Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "doc",
                    docId: "quick-start",
                    position: "left",
                    label: "Docs",
                },
                {
                    type: "doc",
                    docId: "api/index",
                    position: "left",
                    label: "API",
                },
                {
                    href: "https://github.com/yiliansource/party-js",
                    position: "right",
                    className: "header-github-link",
                },
            ],
        },
        footer: {
            style: "light",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Quick Start",
                            to: "docs/",
                        },
                        {
                            label: "Contributing",
                            to: "docs/contributing",
                        },
                        {
                            label: "Migrating from v1 to v2",
                            to: "docs/migrating-v1-v2",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "Guides",
                            to: "docs/guides/using-templates",
                        },
                        {
                            label: "Changelog",
                            to: "docs/changelog",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/yiliansource/party-js",
                        },
                    ],
                },
            ],
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                debug: true,
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl: "https://github.com/yiliansource/party-js/edit/main/docs/",
                },
                theme: {
                    customCss: [require.resolve("./src/css/custom.scss")],
                },
            },
        ],
    ],
};
