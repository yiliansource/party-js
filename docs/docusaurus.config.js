module.exports = {
    title: "party.js",
    tagline:
        "A JavaScript library to brighten up your user's site experience with visual effects!",
    url: "https://party.js.org/",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/logo.svg",
    organizationName: "yiliansource",
    projectName: "party-js",
    stylesheets: [],
    plugins: [],
    scripts: [],
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
            theme: require("prism-react-renderer/themes/dracula"),
        },
        googleAnalytics: {
            trackingID: "G-EWQS5KE2B5",
            anonymizeIP: true,
        },
        navbar: {
            title: "party.js",
            logo: {
                alt: "party.js Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    to: "docs/",
                    activeBasePath: "docs",
                    label: "Docs",
                    position: "left",
                },
                {
                    href: "https://github.com/yiliansource/party-js",
                    label: "GitHub",
                    position: "right",
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
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/yiliansource/party-js",
                        },
                    ],
                },
            ],
            copyright: `<div class="copynote">Copyright © ${new Date().getFullYear()} Ian Hornik. Built with <span style="color: #e31b23;">❤</span> and Docusaurus.<br>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>`,
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                debug: true,
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl:
                        "https://github.com/yiliansource/party-js/edit/main/docs/",
                },
                theme: {
                    customCss: [
                        require.resolve("./src/css/custom.css"),
                        require.resolve("./src/css/components.css"),
                    ],
                },
            },
        ],
    ],
};
