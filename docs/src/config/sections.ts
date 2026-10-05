import type { GlyphKey } from "../brand/glyphs";

interface SectionConfig {
	label: string;
	folder: string | null;
	glyph: GlyphKey;
}

export const sections = {
	start: {
		label: "Start here",
		folder: null,
		glyph: "star",
	},
	effects: {
		label: "Effects",
		folder: "effects",
		glyph: "square",
	},
	concepts: {
		label: "Concepts",
		folder: "concepts",
		glyph: "circle",
	},
	guides: {
		label: "Guides",
		folder: "guides",
		glyph: "strip",
	},
	reference: {
		label: "Reference",
		folder: "api",
		glyph: "tile",
	},
} as const satisfies Record<string, SectionConfig>;

export type Section = keyof typeof sections;

export function sectionOf(entryId: string): Section | null {
	const [first, ...rest] = entryId.split("/");
	if (rest.length > 0) {
		for (const key of Object.keys(sections) as Section[]) {
			if (sections[key].folder === first) {
				return key;
			}
		}
	} else {
		if (entryId !== "index") return "start";
	}
	return null;
}

export const sectionLabel = (section: Section) => sections[section].label;
