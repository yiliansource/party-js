import type { Vec3 } from "../math";
import { fromAxisAngle, type Quat } from "../math/quat";
import { requireAxis } from "./helpers";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler for random rotations. If no axis is provided then each orientation is equally likely,
 * otherwise the rotation is only created around the given axis.
 *
 * For example, rotations around +z keep flat shapes facing the viewer, only turning them within the screen plane.
 *
 * @param axis - Optionally, the axis to create the rotation around.
 *
 * @summary Picks a random rotation.
 *
 * @see Shoemake, K. (1992). "III.6 - Uniform Random Rotations."
 *
 * @group Samplers
 */
export function randomOrientation(axis?: Readonly<Vec3>): SamplerFn<Quat> {
	if (axis) {
		const fixed = requireAxis(axis, "randomOrientation() axis");
		return (ctx) => fromAxisAngle(fixed, ctx.rng() * 2 * Math.PI);
	}

	return (ctx) => {
		const x1 = ctx.rng();
		const x2 = ctx.rng();
		const x3 = ctx.rng();
		const r1 = Math.sqrt(1 - x1);
		const r2 = Math.sqrt(x1);
		const t1 = 2 * Math.PI * x2;
		const t2 = 2 * Math.PI * x3;
		return {
			x: r1 * Math.sin(t1),
			y: r1 * Math.cos(t1),
			z: r2 * Math.sin(t2),
			w: r2 * Math.cos(t2),
		};
	};
}
