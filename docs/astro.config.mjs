// @ts-check
import { fileURLToPath } from "node:url";

import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	trailingSlash: "always",
	integrations: [
		starlight({
			title: "party.js",
			customCss: ["./src/styles/global.css"],
			disable404Route: true,
			titleDelimiter: "—",
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
			},
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
