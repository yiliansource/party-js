import type { ParticleShape } from "party-js";

import { DEFAULT_IMAGE_URL, HEART_PATH_D } from "../defaults";

export type ShapeType =
	| "square"
	| "circle"
	| "star"
	| "polygon"
	| "path"
	| "text"
	| "image";

export interface ShapeDraft {
	type: ShapeType;
	square: { aspectRatio: number; cornerRadius: number };
	star: { points: number };
	polygon: { sides: number };
	path: { d: string };
	text: { text: string; font: string };
	image: { image: string };
}

export const SHAPE_DEFAULTS = {
	square: { aspectRatio: 1, cornerRadius: 0 },
	star: { points: 5 },
} as const;

export const createShapeDraft = (type: ShapeType = "circle"): ShapeDraft => ({
	type,
	square: { ...SHAPE_DEFAULTS.square },
	star: { ...SHAPE_DEFAULTS.star },
	polygon: { sides: 5 },
	path: { d: HEART_PATH_D },
	text: { text: "🎉", font: "" },
	image: { image: DEFAULT_IMAGE_URL },
});

export function toParticleShape(draft: ShapeDraft): ParticleShape {
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
		case "text":
			return {
				type: "text",
				text: draft.text.text,
				font: draft.text.font !== "" ? draft.text.font : undefined,
			};
		case "image":
			return { type: "image", image: draft.image.image.trim() };
	}
}
