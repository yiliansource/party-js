import * as quat from "../math/quat";
import type { Vec2 } from "../math/vec2";
import type { Particle } from "../particle/particle";

/**
 * A 2D affine transform, in the exact parameter order what Canvas2D's `ctx.transform(a, b, c, d, e, f)`
 * expects. Maps a particle's local shape coordinates to canvas pixel coordinates:
 *
 *     x' = a*x + c*y + e
 *     y' = b*x + d*y + f
 */
export interface ProjectedTransform {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
}

/**
 * Projects a particle's 3D position and orientation onto the 2D canvas.
 *
 * This is an orthographic projection; the particle's local z axis is dropped.
 *
 * This also flips the y-axis, since the physics world is y-up, but the canvas is y-down.
 */
export function project(
	particle: Pick<Particle, "position" | "orientation" | "size">,
	origin: Vec2,
): ProjectedTransform {
	const basis = quat.basis(particle.orientation);
	const { size, position } = particle;

	return {
		a: basis.x.x * size,
		b: -basis.x.y * size,
		c: basis.y.x * size,
		d: -basis.y.y * size,
		e: origin.x + position.x,
		f: origin.y - position.y,
	};
}
