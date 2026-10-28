// @ts-check
// #region import
import { createEffect } from "party-js";
// #endregion
import { cone, drag, emissionTarget, emitFrom, fade, gravity, randomOrientation, randomSpin, range } from "party-js";

/** @import { Demo } from "./types" */
/** @import { LightingFn } from "party-js" */

/** @type {LightingFn} */
// #region demo
// darker at an angle, with a white flash when facing the light directly
const glint = (color, coefficient) => {
	const facing = Math.abs(coefficient);
	const shine = facing ** 16; // close to 0, unless facing the light
	return {
		...color,
		l: color.l * (0.5 + 0.5 * facing) + (1 - color.l) * shine,
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
		schedule: { bursts: [{ count: range(40, 60) }] },
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(90, 40, range(400, 700)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(180, 360),
			size: range(8, 12),
			color: "#d4a017",
			shape: { type: "square", aspectRatio: 0.6 },
			lifetime: range(2, 3),
		},
		behaviors: [gravity(800), drag(800 / 400 ** 2), fade(0, 1)],
		// #endregion
		lighting: glint,
	});
	// #endregion
};
