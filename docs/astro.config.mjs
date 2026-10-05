// @ts-check
import { fileURLToPath } from "node:url";

import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { site } from "./src/config/site";

// https://astro.build/config
export default defineConfig({
	trailingSlash: "always",
	site: site.url,
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
					label: "Start here",
					items: [
						"introduction",
						"installation",
						"quickstart",
						"migrating-from-v2",
					],
				},
				{
					label: "Effects",
					items: [{ autogenerate: { directory: "effects" } }],
				},
				{
					label: "Concepts",
					items: [{ autogenerate: { directory: "concepts" } }],
				},
				{
					label: "Guides",
					items: [{ autogenerate: { directory: "guides" } }],
				},
			],
			components: {
				Hero: "./src/components/Hero.astro",
				Header: "./src/components/Header.astro",
				SocialIcons: "./src/components/SocialIcons.astro",
				ThemeProvider: "./src/components/ThemeProvider.astro",
				ThemeSelect: "./src/components/ThemeToggle.astro",
			},
			routeMiddleware: "./src/routeData.ts",
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
