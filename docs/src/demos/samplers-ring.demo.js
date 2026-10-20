// @ts-check
// #region import
import { createEffect } from "party-js";
// #endregion
import { emissionTarget, pick, randomOrientation, randomSpin, range, scale } from "party-js";

/** @import { Demo } from "./types" */
/** @import { SamplerFn, Vec3 } from "party-js" */

/**
 * @param {number} radius
 * @returns {SamplerFn<Vec3>}
 */
// #region demo
const ring = (radius) => (ctx) => {
	const { index, size } = ctx.batch ?? { index: 0, size: 1 };
	const angle = (2 * Math.PI * index) / size;
	return {
		x: Math.cos(angle) * radius,
		y: Math.sin(angle) * radius,
		z: 0,
	};
};
// #endregion

/** @type {Demo} */
export const run = ({ target }) => {
	const { origin } = emissionTarget(target);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: range(10, 20) }] },
		// #endregion
		particleInit: {
			position: ring(120),
			// #region collapse
			velocity: { x: 0, y: 0, z: 0 },
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: 16,
			color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: 2,
			// #endregion
		},
		// #region omit
		behaviors: [scale(0.1, 0.5)],
		// #endregion
	});
	// #endregion
};
