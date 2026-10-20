// #region import
import { createEffect, drag, emissionTarget, emitFrom, fade, gravity, pick, range, scale } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	const { origin, shape } = emissionTarget(button);

	createEffect({
		origin,
		schedule: { bursts: [{ count: range(15, 25) }] },
		particleInit: {
			position: emitFrom(shape),
			size: range(8, 16),
			color: pick(["#7dd3fc", "#a5b4fc", "#99f6e4"]),
			shape: { type: "circle" },
			lifetime: range(2, 3),
		},
		behaviors: [gravity(-300), drag(0.01), scale(0.3, 0), fade(0, 1)],
	});
	// #endregion
};
