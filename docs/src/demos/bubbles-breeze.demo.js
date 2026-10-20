// @ts-check
// #region import
import { createEffect, drag, fade, gravity, scale } from "party-js";
// #endregion
import { emissionTarget, range, emitFrom, pick } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior } from "party-js" */

/**
 * @param {number} strength
 * @returns {Behavior}
 */
// #region demo
const breeze = (strength) => (particle, ctx) => {
	particle.velocity = {
		...particle.velocity,
		x: particle.velocity.x + strength * ctx.dt,
	};
};
// #endregion

/** @type {Demo} */
export const run = ({ target: button }) => {
	const { origin, shape } = emissionTarget(button);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: range(15, 25) }] },
		particleInit: {
			position: emitFrom(shape),
			size: range(8, 16),
			color: pick(["#7dd3fc", "#a5b4fc", "#99f6e4"]),
			shape: { type: "circle" },
			lifetime: range(2, 3),
		},
		// #endregion
		behaviors: [gravity(-300), drag(0.01), breeze(100), scale(0.3, 0), fade(0, 1)],
	});
	// #endregion
};
