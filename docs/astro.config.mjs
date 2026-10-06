// @ts-check
import { fileURLToPath } from "node:url";

import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlightTypeDoc from "starlight-typedoc";

import { referenceGroups } from "./src/config/reference";
import { sections } from "./src/config/sections";
import { site } from "./src/config/site";
import { reference } from "./src/plugins/reference";

// https://astro.build/config
export default defineConfig({
	trailingSlash: "always",
	site: site.url,
	markdown: {
		processor: satteri({
			hastPlugins: [reference],
		}),
	},
	integrations: [
		starlight({
			title: site.name,
			description: site.tagline,
			customCss: ["./src/styles/global.css"],
			disable404Route: true,
			titleDelimiter: "—",
			head: [
				{
					tag: "meta",
					attrs: {
						name: "theme-color",
						content: "#FFFFFF",
						media: "(prefers-color-scheme: light)",
					},
				},
				{
					tag: "meta",
					attrs: {
						name: "theme-color",
						content: "#1A1A1A",
						media: "(prefers-color-scheme: dark)",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "apple-touch-icon",
						href: "/apple-touch-icon.png",
					},
				},
			],
			sidebar: [
				{
					label: sections.start.label,
					items: [
						"introduction",
						"installation",
						"quickstart",
						"migrating-from-v2",
					],
				},
				{
					label: sections.effects.label,
					items: [{ autogenerate: { directory: "effects" } }],
				},
				{
					label: sections.concepts.label,
					items: [{ autogenerate: { directory: "concepts" } }],
				},
				{
					label: sections.guides.label,
					items: [{ autogenerate: { directory: "guides" } }],
				},
				{
					label: sections.reference.label,
					items: [
						...referenceGroups.map((group) => ({
							label: group,
							items: [
								{ autogenerate: { directory: `api/${group}` } },
							],
						})),
					],
				},
			],
			components: {
				Hero: "./src/components/starlight/Hero.astro",
				Header: "./src/components/starlight/Header.astro",
				Footer: "./src/components/starlight/Footer.astro",
				SocialIcons: "./src/components/starlight/SocialIcons.astro",
				ThemeProvider: "./src/components/starlight/ThemeProvider.astro",
				ThemeSelect: "./src/components/starlight/ThemeToggle.astro",
				PageTitle: "./src/components/starlight/PageTitle.astro",
				Sidebar: "./src/components/starlight/Sidebar.astro",
				TableOfContents:
					"./src/components/starlight/TableOfContents.astro",
				Pagination: "./src/components/starlight/Pagination.astro",
			},
			routeMiddleware: "./src/routeData.ts",
			expressiveCode: {
				defaultProps: {
					wrap: true,
				},
			},
			plugins: [
				starlightTypeDoc({
					entryPoints: ["../src/index.ts"],
					tsconfig: "../tsconfig.json",
					pagination: true,
					typeDoc: {
						name: "API reference",
						lang: "en",
						router: "group",
						entryFileName: "index",
						groupOrder: [
							...referenceGroups,
							"Constructors",
							"Properties",
							"Accessors",
							"Methods",
							"*",
						],
						plugin: ["./typedoc/reference-frontmatter.mjs"],
						useCodeBlocks: true,
						formatWithPrettier: true,
						prettierConfigFile: "./.prettierrc.typedoc.json",
						excludeExternals: true,
						expandParameters: true,
						interfacePropertiesFormat: "table",
						classPropertiesFormat: "table",
						typeAliasPropertiesFormat: "table",
						propertyMembersFormat: "table",
						tableColumnSettings: { hideSources: true },
					},
				}),
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"party-js": fileURLToPath(
					new URL("../src/index.ts", import.meta.url),
				),
			},
		},
	},
});
