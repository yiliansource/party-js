// #region import
import { cone, createEffect, emissionTarget, emitFrom, fade, gravity, pick, randomOrientation, randomSpin, range, scale } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	const { origin, shape } = emissionTarget(button);

	createEffect({
		origin,
		schedule: { bursts: [{ count: 30 }] },
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(90, 30, range(300, 600)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 360),
			size: range(8, 12),
			color: pick(["#7dd3fc", "#38bdf8", "#0ea5e9"]),
			shape: { type: "square", aspectRatio: 0.5 },
			lifetime: range(1.5, 2.5),
		},
		behaviors: [gravity(800), scale(0.1, 0), fade(0, 0.5)],
	});
	// #endregion
};
