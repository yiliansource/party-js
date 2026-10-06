export type Glyph = { viewBox: string; body: string };

export const glyphs = {
	star: {
		viewBox: "-1 -1 2 2",
		body: '<polygon points="0,-1 0.26,-0.36 0.95,-0.31 0.43,0.14 0.59,0.81 0,0.45 -0.59,0.81 -0.43,0.14 -0.95,-0.31 -0.26,-0.36" />',
	},
	square: {
		viewBox: "0 0 24 24",
		body: '<rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(-9 12 12)" />',
	},
	circle: {
		viewBox: "0 0 24 24",
		body: '<circle cx="12" cy="12" r="9" />',
	},
	strip: {
		viewBox: "0 0 24 24",
		body: '<rect x="8" y="1" width="10" height="22" rx="5" transform="rotate(35 12 12)" />',
	},
	tile: {
		viewBox: "0 0 10 10",
		body: '<rect x="3" y="3" width="18" height="18" rx="4" />',
	},
} as const satisfies Record<string, Glyph>;

export type GlyphKey = keyof typeof glyphs;

export const glyphSvg = (key: GlyphKey, color = "currentColor") =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${glyphs[key].viewBox}" fill="${color}">${glyphs[key].body}</svg>`;
