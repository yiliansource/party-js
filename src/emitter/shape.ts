import type { Vec3 } from "../math/vec3";
import type { SamplerFn } from "../samplers/types";

export interface DiskEmissionShape {
	type: "disk";
	center: Vec3;
	radius: number;
}

export interface RectEmissionShape {
	type: "rect";
	center: Vec3;
	width: number;
	height: number;
}

export type EmissionShape = DiskEmissionShape | RectEmissionShape;

export function emitFrom(shape: EmissionShape): SamplerFn<Vec3> {
	switch (shape.type) {
		case "disk":
			return diskSampler(shape);
		case "rect":
			return rectSampler(shape);
	}
}

function diskSampler(shape: DiskEmissionShape): SamplerFn<Vec3> {
	const { center, radius } = shape;
	return (ctx) => {
		const theta = ctx.rng() * 2 * Math.PI;
		const r = radius * Math.sqrt(ctx.rng());
		return {
			x: center.x + Math.cos(theta) * r,
			y: center.y + Math.sin(theta) * r,
			z: center.z,
		};
	};
}

function rectSampler(shape: RectEmissionShape): SamplerFn<Vec3> {
	const { center, width, height } = shape;
	return (ctx) => ({
		x: center.x + (ctx.rng() - 0.5) * width,
		y: center.y + (ctx.rng() - 0.5) * height,
		z: center.z,
	});
}
