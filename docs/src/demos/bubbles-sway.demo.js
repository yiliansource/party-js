// @ts-check
// #region import
import { createEffect, drag, fade, gravity, scale } from "party-js";
// #endregion
import { emitFrom, measureTarget, pick, range } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior } from "party-js" */

/**
 * @param {number} strength
 * @returns {Behavior}
 */
// #region demo
// pushes each particle from side to side, starting at a random point of the swing
const sway = (strength) => {
	const phaseMap = new WeakMap();
	return {
		init(particle, ctx) {
			phaseMap.set(particle, ctx.rng() * 2 * Math.PI);
		},
		update(particle, ctx) {
			// #region omit
			/** @type {number} */
			// #endregion
			const offset = phaseMap.get(particle);
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
	const { origin, area } = measureTarget(button);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: range(15, 25) }] },
		particleInit: {
			position: emitFrom(area),
			velocity: { x: 0, y: 0, z: 0 },
			orientation: { x: 0, y: 0, z: 0, w: 1 },
			angularVelocity: { x: 0, y: 0, z: 0 },
			size: range(8, 16),
			color: pick(["#7dd3fc", "#a5b4fc", "#99f6e4"]),
			shape: { type: "circle" },
			lifetime: range(2, 3),
		},
		// #endregion
		behaviors: [gravity(-300), drag(1.7), sway(200), scale(0.3, 0), fade(0, 1)],
	});
	// #endregion
};
