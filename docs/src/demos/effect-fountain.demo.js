// @ts-check
// #region import
import { createEffect, emissionTarget } from "party-js";
// #endregion
import { cone, emitFrom, fade, gravity, pick, randomOrientation, randomSpin, range, scale } from "party-js";

/** @import { Demo } from "./types" */
/** @import { Effect } from "party-js" */

// #region demo
// #region omit
/** @type {Effect | undefined} */
// #endregion
let fountain;
// #endregion

/** @type {Demo} */
export const run = ({ target: button }) => {
	// #region demo
	// the first click starts the fountain, the second one stops it
	if (fountain) {
		fountain.stop();
		fountain = undefined;
	} else {
		const { origin, shape } = emissionTarget(button);

		fountain = createEffect({
			origin,
			schedule: { rate: 40, loops: Infinity },
			// #region collapse
			particleInit: {
				position: emitFrom(shape),
				velocity: cone(90, 15, range(400, 600)),
				orientation: randomOrientation(),
				angularVelocity: randomSpin(90, 360),
				size: range(8, 12),
				color: pick(["#7dd3fc", "#38bdf8", "#0ea5e9"]),
				shape: { type: "square", aspectRatio: 0.5 },
				lifetime: range(1.5, 2.5),
			},
			behaviors: [gravity(800), scale(0.1, 0), fade(0, 0.5)],
			// #endregion
		});
	}
	// #endregion
};
