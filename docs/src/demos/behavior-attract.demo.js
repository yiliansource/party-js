// @ts-check
// #region import
import { createEffect, scale } from "party-js";
// #endregion
import { emissionTarget, emitFrom, pick, randomOrientation, randomSpin, range } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior, Vec2 } from "party-js" */

/**
 * @param {Vec2} point
 * @param {number} strength
 * @returns {Behavior}
 */
// #region demo
const attract = (point, strength) => (particle, ctx) => {
	const dx = point.x - particle.position.x;
	const dy = point.y - particle.position.y;
	const distance = Math.hypot(dx, dy) || 1;
	particle.velocity = {
		...particle.velocity,
		x: particle.velocity.x + (dx / distance) * strength * ctx.dt,
		y: particle.velocity.y + (dy / distance) * strength * ctx.dt,
	};
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
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: 16,
			color: pick(["#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: range(3, 4),
		},
		// #endregion
		behaviors: [attract({ x: 60, y: -40 }, 100), scale(0.25, 1)],
	});
	// #endregion
};
