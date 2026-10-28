// #region import
import { createEffect, createLighting } from "party-js";
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
		particleInit: {
			position: (ctx) => ({ x: ((ctx.batch?.index ?? 0) - 2) * 48, y: 70, z: 0 }),
			orientation: (ctx) => {
				const half = ((ctx.batch?.index ?? 0) * Math.PI) / 10;
				return { x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) };
			},
			angularVelocity: { x: 0, y: 120, z: 0 },
			size: 32,
			color: "#00a699",
			shape: { type: "square", cornerRadius: 0.15 },
			lifetime: 3,
		},
		behaviors: [scale(0.2, 0.3)],
		// #endregion
		lighting: createLighting({ ambient: 0.2, peak: 1.5 }),
	});
	// #endregion
};
