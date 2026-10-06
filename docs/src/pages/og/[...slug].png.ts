import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

import { Resvg } from "@resvg/resvg-js";
import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";

import { type CollectionEntry, getCollection } from "astro:content";

import LogoMark from "../../assets/mark-l-dark.svg?raw";
import { glyphSvg } from "../../brand/glyphs";
import {
	type SectionKey,
	sectionLabel,
	sectionOf,
	sections,
} from "../../config/sections";
import { site } from "../../config/site";

const require = createRequire(import.meta.url);
const font = (family: string, file: string) =>
	readFile(require.resolve(`@fontsource/${family}/files/${file}`));

const geistRegular = await font("geist", "geist-latin-400-normal.woff");
const geistBold = await font("geist", "geist-latin-700-normal.woff");
const geistMono = await font("geist-mono", "geist-mono-latin-400-normal.woff");
const fredoka = await font("fredoka", "fredoka-latin-500-normal.woff");

const logoBase64 = Buffer.from(LogoMark).toString("base64");

const h = (type: string, props: Record<string, unknown>) => ({
	type,
	props,
});

const glyphNode = (key: SectionKey, size = 24) => {
	const sectionData = sections[key];

	return h("img", {
		src: `data:image/svg+xml;base64,${Buffer.from(glyphSvg(sectionData.glyph, sectionData.accent)).toString("base64")}`,
		width: size,
		height: size,
	});
};

const buildDefaultCard = () =>
	h("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			height: "100%",
			fontFamily: "Geist",
			fontWeight: 400,
			textAlign: "center",
			color: "#ffffff",
			backgroundColor: "#1a1a1a",
		},
		children: [
			h("img", {
				style: {
					height: "231px",
				},
				src: `data:image/svg+xml;base64,${logoBase64}`,
			}),
			h("div", {
				style: {
					marginTop: "-8px",
					fontFamily: "Fredoka",
					fontSize: "128px",
				},
				children: site.name,
			}),
			h("div", {
				style: {
					marginTop: "24px",
					fontSize: "32px",
					color: "#d6d6dc",
					maxWidth: "760px",
				},
				children: site.tagline,
			}),
		],
	});

const buildDocsCard = (
	section: SectionKey,
	title: string,
	description?: string,
) =>
	h("div", {
		style: {
			display: "flex",
			flexDirection: "row",
			width: "100%",
			height: "100%",
			fontFamily: "Geist",
			fontWeight: 400,
			color: "#ffffff",
			backgroundColor: "#1a1a1a",
		},
		children: [
			h("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					flexGrow: "1",
					height: "100%",
					padding: "76px 80px 64px",
				},
				children: [
					h("div", {
						style: {
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: "12px",
						},
						children: [
							glyphNode(section),
							h("div", {
								style: {
									fontFamily: "Geist Mono",
									fontSize: "24px",
									color: "#a3a3ad",
								},
								children: sectionLabel(section),
							}),
						],
					}),
					h("div", {
						style: {
							marginTop: "28px",
							maxWidth: "600px",
							fontWeight: 700,
							fontSize: "84px",
							lineHeight: 1,
						},
						children: title,
					}),
					h("div", {
						style: {
							marginTop: "26px",
							maxWidth: "600px",
							fontSize: "30px",
							color: "#d6d6dc",
							lineHeight: 1.4,
						},
						children: description,
					}),
					h("div", {
						style: {
							margin: "auto 0 0 0",
							fontFamily: "Fredoka",
							fontSize: "44px",
						},
						children: "party.js",
					}),
				],
			}),
			h("img", {
				style: {
					position: "absolute",
					top: "132px",
					right: "72px",
					width: "400px",
				},
				src: `data:image/svg+xml;base64,${logoBase64}`,
			}),
		],
	});

export const getStaticPaths = (async () => {
	const entries = await getCollection("docs");
	return entries.map((entry) => ({
		params: { slug: entry.id },
		props: {
			entry,
			section: sectionOf(entry.id),
		},
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
	const section = props.section as SectionKey | null;
	const entry = props.entry as CollectionEntry<"docs">;

	const card =
		section === null
			? buildDefaultCard()
			: buildDocsCard(section, entry.data.title, entry.data.description);

	const svg = await satori(card, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Geist",
				data: geistRegular,
				weight: 400,
				style: "normal",
			},
			{
				name: "Geist",
				data: geistBold,
				weight: 700,
				style: "normal",
			},
			{
				name: "Geist Mono",
				data: geistMono,
				weight: 400,
				style: "normal",
			},
			{
				name: "Fredoka",
				data: fredoka,
				weight: 500,
				style: "normal",
			},
		],
	});

	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), {
		headers: { "Content-Type": "image/png" },
	});
};
