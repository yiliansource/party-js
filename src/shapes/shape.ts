import type { CircleShape } from "./circle";
import type { PolygonShape } from "./polygon";
import type { SquareShape } from "./square";
import type { StarShape } from "./star";

export interface PathShape {
	type: "path";
	path: Path2D;
}

export interface CustomShape {
	type: "custom";
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export type ParticleShape =
	| SquareShape
	| CircleShape
	| StarShape
	| PolygonShape
	| PathShape
	| CustomShape;
