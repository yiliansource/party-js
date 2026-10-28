// @ts-check
// #region import
import { createEffect, drag, fade, gravity, scale } from "party-js";
// #endregion
import { emissionTarget, emitFrom, pick, range } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior } from "party-js" */

/**
 * @param {number} strength
 * @returns {Behavior}
 */
// #region demo
// pushes each particle from side to side, starting at a random point of the swing
const sway = (strength) => {
	const phase = Symbol("sway.phase");
	return {
		init(particle, ctx) {
			particle.data.set(phase, ctx.rng() * 2 * Math.PI);
		},
		update(particle, ctx) {
			// #region omit
			/** @type {number} */
			// @ts-expect-error: particle.data stores unknown values
			// #endregion
			const offset = particle.data.get(phase);
			const push = Math.cos(particle.age * 3 + offset) * strength * ctx.dt;
			particle.velocity = {
				...particle.velocity,
				x: particle.velocity.x + push,
			};
		},
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
			velocity: { x: 0, y: 0, z: 0 },
			orientation: { x: 0, y: 0, z: 0, w: 1 },
			angularVelocity: { x: 0, y: 0, z: 0 },
			size: range(8, 16),
			color: pick(["#7dd3fc", "#a5b4fc", "#99f6e4"]),
			shape: { type: "circle" },
			lifetime: range(2, 3),
		},
		// #endregion
		behaviors: [gravity(-300), drag(0.01), sway(200), scale(0.3, 0), fade(0, 1)],
	});
	// #endregion
};
