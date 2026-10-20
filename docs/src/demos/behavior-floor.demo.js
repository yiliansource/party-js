// @ts-check
// #region import
import { createEffect, gravity } from "party-js";
// #endregion
import { cone, emissionTarget, emitFrom, pick, range, randomOrientation, randomSpin } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior } from "party-js" */

/**
 * @param {number} y
 * @returns {Behavior}
 */
// #region demo
const floor = (y) => (particle) => {
	if (particle.position.y < y) particle.age = particle.lifetime;
};
// #endregion

/** @type {Demo} */
export const run = ({ target }) => {
	const { origin, shape } = emissionTarget(target);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: 30 }] },
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(90, 30, range(200, 400)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: 16,
			color: pick(["#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: range(1, 2),
		},
		// #endregion
		behaviors: [gravity(800), floor(-200)],
	});
	// #endregion
};
