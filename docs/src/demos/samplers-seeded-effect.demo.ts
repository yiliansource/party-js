// #region import
import { createEffect } from "party-js";
// #endregion
import { cone, emissionTarget, emitFrom, fade, gravity, pick, randomOrientation, randomSpin, range, scale } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target }) => {
	const { origin, shape } = emissionTarget(target);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: range(10, 20) }] },
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(90, 30, range(200, 600)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: range(10, 16),
			color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: 2,
		},
		behaviors: [gravity(800), scale(0.1, 0), fade(0, 1)],
		// #endregion
		seed: 42,
	});
	// #endregion
};
