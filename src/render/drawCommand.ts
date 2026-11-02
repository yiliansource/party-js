import { format as formatColor } from "../color/format";
import type { Particle } from "../particle/particle";
import { circlePath } from "../shapes/circle";
import { fitImage, resolveImage } from "../shapes/image";
import { polygonPath } from "../shapes/polygon";
import type { ParticleShape } from "../shapes/shape";
import { squarePath } from "../shapes/square";
import { starPath } from "../shapes/star";
import type { LightingFn } from "./lighting";
import type { ProjectedTransform } from "./projection";

export type DrawCommand =
	| {
			kind: "path";
			path: Path2D;
			transform: ProjectedTransform;
			fillStyle: string;
	  }
	| {
			kind: "text";
			text: string;
			font: string;
			transform: ProjectedTransform;
			fillStyle: string;
	  }
	| {
			kind: "image";
			image: CanvasImageSource;
			width: number;
			height: number;
			alpha: number;
			transform: ProjectedTransform;
	  }
	| {
			kind: "custom";
			particle: Readonly<Particle>;
			draw: (
				ctx: CanvasRenderingContext2D,
				particle: Readonly<Particle>,
			) => void;
			transform: ProjectedTransform;
			fillStyle: string;
	  };

export function buildDrawCommand(
	particle: Particle,
	transform: ProjectedTransform,
	lightingCoefficient?: number,
	lighting?: LightingFn | null,
): DrawCommand | null {
	const color =
		lightingCoefficient !== undefined && lighting != null
			? lighting(particle.color, lightingCoefficient)
			: particle.color;
	const fillStyle = formatColor(color);

	const shape = particle.shape;
	switch (shape.type) {
		case "text":
			return {
				kind: "text",
				text: shape.text,
				font: shape.font ?? "sans-serif",
				transform,
				fillStyle,
			};
		case "image": {
			const image = resolveImage(shape.image);
			if (!image) return null;
			const [width, height] = fitImage(image);
			return {
				kind: "image",
				image,
				width,
				height,
				alpha: particle.color.alpha,
				transform,
			};
		}
		case "custom":
			return {
				kind: "custom",
				particle,
				draw: shape.draw,
				transform,
				fillStyle,
			};
		default:
			return {
				kind: "path",
				path: resolveShapePath(shape),
				transform,
				fillStyle,
			};
	}
}

function resolveShapePath(
	shape: Exclude<ParticleShape, { type: "custom" | "text" | "image" }>,
): Path2D {
	switch (shape.type) {
		case "square":
			return squarePath(shape.aspectRatio, shape.cornerRadius);
		case "circle":
			return circlePath();
		case "star":
			return starPath(shape.points, shape.innerRadius);
		case "polygon":
			return polygonPath(shape.sides);
		case "path":
			return shape.path;
	}
}
