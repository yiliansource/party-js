import { type Vec2, zero as vec2Zero } from "../math/vec2";
import type { Vec3 } from "../math/vec3";
import type { SamplerContext, SamplerFn } from "../samplers/types";
import { type Live, resolveLive } from "./live";

/**
 * A filled circle that particles spawn from, with every point inside it equally likely.
 *
 * @summary A circular area that particles spawn from.
 *
 * @group Custom effects
 */
export interface DiskEmissionShape {
	type: "disk";
	/**
	 * The center of the circle, in pixels from the origin.
	 *
	 * @defaultValue { x: 0, y: 0 }
	 */
	center?: Vec2;
	/**
	 * The radius of the circle, in pixels.
	 */
	radius: number;
}

/**
 * A filled rectangle that particles spawn from, with every point inside it equally likely.
 * Set `width` or `height` to 0 to emit particles from a line.
 *
 * @summary A rectangular area that particles spawn from.
 *
 * @group Custom effects
 */
export interface RectEmissionShape {
	type: "rect";
	/**
	 * The center of the rectangle, in pixels from the origin.
	 *
	 * @defaultValue { x: 0, y: 0 }
	 */
	center?: Vec2;
	/**
	 * The width of the rectangle, in pixels.
	 */
	width: number;
	/**
	 * The height of the rectangle, in pixels.
	 */
	height: number;
}

/**
 * An area that particles spawn from, for use with {@link emitFrom | emitFrom()}.
 *
 * Positions are in particle space, i.e. in pixels from the effect's origin, with +y pointing upwards.
 *
 * @summary An area that particles spawn from.
 *
 * @group Custom effects
 */
export type EmissionShape = DiskEmissionShape | RectEmissionShape;

/**
 * Creates a sampler for particle positions spread across an area.
 *
 * The shape is {@link Live}: pass a function to make the follow something that changes, for example the
 * window width. It's read again for every particle that spawns.
 *
 * @param shape - The area to spawn particles from.
 * @returns A sampler for {@link ParticleInit.position}.
 *
 * @summary Spawns particles from an area.
 *
 * @example
 * ```ts
 * // Along a line across the full width of the window.
 * const positionSampler = emitFrom(() => ({ type: "rect", width: window.innerWidth, height: 0 }));
 * ```
 *
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
