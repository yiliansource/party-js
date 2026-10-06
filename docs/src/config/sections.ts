import type { GlyphKey } from "../brand/glyphs";

interface SectionConfig {
	label: string;
	folder: string | null;
	accent: string;
	glyph: GlyphKey;
}

export const sections = {
	start: {
		label: "Start here",
		folder: null,
		accent: "#FF5A5F",
		glyph: "star",
	},
	effects: {
		label: "Effects",
		folder: "effects",
		accent: "#FFB400",
		glyph: "square",
	},
	concepts: {
		label: "Concepts",
		folder: "concepts",
		accent: "#7B61FF",
		glyph: "circle",
	},
	guides: {
		label: "Guides",
		folder: "guides",
		accent: "#00A699",
		glyph: "strip",
	},
	reference: {
		label: "Reference",
		folder: "api",
		accent: "#A3A3AD",
		glyph: "tile",
	},
} as const satisfies Record<string, SectionConfig>;

export type SectionKey = keyof typeof sections;

export function sectionOf(entryId: string): SectionKey | null {
	const [first, ...rest] = entryId.split("/");
	if (rest.length > 0) {
		return (
			(Object.keys(sections) as SectionKey[]).find(
				(key) => sections[key].folder === first,
			) ?? null
		);
	} else {
		if (entryId === "api") return "reference";
		if (entryId !== "index") return "start";
	}
	return null;
}

export const sectionOfHref = (href: string): SectionKey | null => {
	const id = href.slice(import.meta.env.BASE_URL.length).replace(/\/$/, "");
	return sectionOf(id ?? "index");
};

export const sectionByLabel = (label: string): SectionKey | null =>
	(Object.keys(sections) as SectionKey[]).find(
		(key) => sections[key].label === label,
	) ?? null;

export const sectionLabel = (section: SectionKey) => sections[section].label;
