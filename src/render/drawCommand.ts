import { toCssColor } from "../color/color";
import type { Particle } from "../particle/particle";
import { circlePath } from "../shapes/circle";
import { polygonPath } from "../shapes/polygon";
import type { ParticleShape } from "../shapes/shape";
import { squarePath } from "../shapes/square";
import { starPath } from "../shapes/star";
import type { ProjectedTransform } from "./projection";

export type DrawCommand =
	| {
			kind: "path";
			path: Path2D;
			transform: ProjectedTransform;
			fillStyle: string;
	  }
	| {
			kind: "custom";
			draw: (ctx: CanvasRenderingContext2D) => void;
			transform: ProjectedTransform;
			fillStyle: string;
	  };

export function buildDrawCommand(
	particle: Pick<Particle, "shape" | "color">,
	transform: ProjectedTransform,
): DrawCommand {
	if (particle.shape.type === "custom") {
		return {
			kind: "custom",
			draw: particle.shape.draw,
			transform,
			fillStyle: toCssColor(particle.color),
		};
	}

	return {
		kind: "path",
		path: resolveShapePath(particle.shape),
		transform,
		fillStyle: toCssColor(particle.color),
	};
}

function resolveShapePath(
	shape: Exclude<ParticleShape, { type: "custom" }>,
): Path2D {
	switch (shape.type) {
		case "square":
			return squarePath(shape.aspectRatio, shape.cornerRadius);
		case "circle":
			return circlePath();
		case "star":
			return starPath(shape.points);
		case "polygon":
			return polygonPath(shape.sides);
		case "path":
			return shape.path;
	}
}
