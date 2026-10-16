import type { ParticleShape } from "party-js";

import { HEART_PATH_D } from "../defaults";

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

export const createShapeDraft = (type: ShapeType = "circle"): ShapeDraft => ({
	type,
	square: { ...SHAPE_DEFAULTS.square },
	star: { ...SHAPE_DEFAULTS.star },
	polygon: { sides: 5 },
	path: { d: HEART_PATH_D },
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
	}
}
