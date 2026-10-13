import type { ParticleShape } from "party-js";

export type ShapeType = "square" | "circle" | "star" | "polygon" | "path";

export interface ShapeDraft {
	type: ShapeType;
	square: { aspectRatio: number; cornerRadius: number };
	star: { points: number };
	polygon: { sides: number };
	path: { d: string };
}

export const SHAPE_DEFAULTS = {
	square: { aspectRatio: 1, cornerRadius: 0 },
	star: { points: 5 },
} as const;

export const createDraft = (): ShapeDraft => ({
	type: "star",
	square: { ...SHAPE_DEFAULTS.square },
	star: { ...SHAPE_DEFAULTS.star },
	polygon: { sides: 6 },
	path: { d: "M 0 -0.5 L 0.5 0.5 L -0.5 0.5 Z" },
});

export interface PreviewSettings {
	color: "mixed" | (string & {});
	size: number;
	lighting: boolean;
	background: "page" | "light" | "dark";
	paused: boolean;
}

export const createPreview = (): PreviewSettings => ({
	color: "mixed",
	size: 16,
	lighting: true,
	background: "page",
	paused: false,
});

export function toShape(draft: ShapeDraft): ParticleShape {
	switch (draft.type) {
		case "square":
			return { type: "square", ...draft.square };
		case "circle":
			return { type: "circle" };
		case "star":
			return { type: "star", ...draft.star };
		case "polygon":
			return { type: "polygon", ...draft.polygon };
		case "path":
			return { type: "path", path: new Path2D(draft.path.d) };
	}
}
