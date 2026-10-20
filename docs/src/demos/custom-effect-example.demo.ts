// #region import
import { cone, createEffect, emissionTarget, emitFrom, fade, gravity, pick, randomOrientation, randomSpin, range } from "party-js";
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
			velocity: cone(90, 30, range(200, 400)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: range(8, 14),
			color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: range(1, 2),
		},
		behaviors: [gravity(800), fade(0, 0.5)],
	});
	// #endregion
};
