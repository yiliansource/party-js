import { type Vec2, zero as vec2Zero } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import type { SamplerContext, SamplerFn } from "../samplers/types";
import { type Live, resolveLive } from "./live";

/**
 * @group Custom effects
 */
export interface DiskEmissionShape {
	type: "disk";
	center?: Vec2;
	radius: number;
}

/**
 * @group Custom effects
 */
export interface RectEmissionShape {
	type: "rect";
	center?: Vec2;
	width: number;
	height: number;
}

/**
 * @group Custom effects
 */
export type EmissionShape = DiskEmissionShape | RectEmissionShape;

/**
 * @group Custom effects
 */
export function emitFrom(shape: Live<EmissionShape>): SamplerFn<Vec3> {
	return (ctx) => {
		const s = resolveLive(shape);
		switch (s.type) {
			case "disk":
				return sampleDisk(s, ctx);
			case "rect":
				return sampleRect(s, ctx);
		}
	};
}

function sampleDisk(s: DiskEmissionShape, ctx: SamplerContext): Vec3 {
	const theta = ctx.rng() * 2 * Math.PI;
	const center = s.center ?? vec2Zero;
	const r = s.radius * Math.sqrt(ctx.rng());
	return {
		x: center.x + Math.cos(theta) * r,
		y: center.y + Math.sin(theta) * r,
		z: 0,
	};
}

function sampleRect(s: RectEmissionShape, ctx: SamplerContext): Vec3 {
	const center = s.center ?? vec2Zero;
	return {
		x: center.x + (ctx.rng() - 0.5) * s.width,
		y: center.y + (ctx.rng() - 0.5) * s.height,
		z: 0,
	};
}
