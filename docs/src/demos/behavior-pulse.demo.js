// @ts-check
// #region import
import { createEffect, scale } from "party-js";
// #endregion
import { emissionTarget, emitFrom, pick, range } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior } from "party-js" */

/** @type {Behavior} */
// #region demo
const pulse = (particle) => {
	particle.size *= 1 + 0.3 * Math.sin(particle.age * 10);
};
// #endregion

/** @type {Demo} */
export const run = ({ target }) => {
	const { origin, shape } = emissionTarget(target);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: range(10, 20) }] },
		particleInit: {
			position: emitFrom(shape),
			velocity: { x: 0, y: 0, z: 0 },
			size: 16,
			color: pick(["#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: 2,
		},
		// #endregion
		behaviors: [scale(0.2, 0.5), pulse],
	});
	// #endregion
};
