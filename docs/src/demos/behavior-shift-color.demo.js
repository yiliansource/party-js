// @ts-check
// #region import
import { createEffect, gravity, color, scale } from "party-js";
// #endregion
import { cone, emissionTarget, emitFrom, range, randomOrientation, randomSpin } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Behavior, Color } from "party-js" */

/**
 * @param {string} target
 * @returns {Behavior}
 */
// #region demo
const shiftTo = (target) => {
	const to = color(target);
	const from = Symbol("shiftTo.from");

	return {
		init(particle) {
			particle.data.set(from, particle.color);
		},
		update(particle) {
			// #region omit
			/** @type {Color} */
			// @ts-expect-error: particle.data stores unknown values
			// #endregion
			const start = particle.data.get(from);
			const t = particle.age / particle.lifetime;
			particle.color = {
				...particle.color,
				l: start.l + (to.l - start.l) * t,
				a: start.a + (to.a - start.a) * t,
				b: start.b + (to.b - start.b) * t,
			};
		},
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
			velocity: cone(90, 30, range(200, 400)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: range(12, 16),
			color: "#ffb400",
			shape: { type: "circle" },
			lifetime: range(0.5, 1),
		},
		// #endregion
		behaviors: [gravity(800), shiftTo("#00a699"), scale(0, 0.25)],
	});
	// #endregion
};
