// #region import
import { createEffect } from "party-js";
// #endregion
import { emissionTarget, scale } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	const { origin } = emissionTarget(button);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: 5 }] },
		// #endregion
		particleInit: {
			// #region collapse
			// a row of squares above the button, each turned a little further than the last
			position: (ctx) => ({ x: ((ctx.batch?.index ?? 0) - 2) * 48, y: 70, z: 0 }),
			orientation: (ctx) => {
				const half = ((ctx.batch?.index ?? 0) * Math.PI) / 10;
				return { x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) };
			},
			size: 32,
			color: "#00a699",
			shape: { type: "square", cornerRadius: 0.15 },
			lifetime: 3,
			// #endregion
			angularVelocity: { x: 0, y: 120, z: 0 },
		},
		// #region omit
		behaviors: [scale(0.2, 0.3)],
		// #endregion
		lighting: null,
	});
	// #endregion
};
