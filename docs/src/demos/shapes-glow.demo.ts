// #region import
import { createEffect } from "party-js";
// #endregion
import { cone, emissionTarget, emitFrom, fade, pick, range } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	const { origin, shape } = emissionTarget(button);

	// #region demo
	createEffect({
		// #region collapse
		origin,
		schedule: { bursts: [{ count: 20 }] },
		// #endregion
		particleInit: {
			// #region collapse
			position: emitFrom(shape),
			velocity: cone(90, 30, range(40, 100)),
			size: range(16, 28),
			color: pick(["#fde68a", "#bef264", "#a5f3fc"]),
			lifetime: range(2, 3),
			// #endregion
			shape: {
				type: "custom",
				draw(ctx) {
					// three circles on top of each other, fainter towards the outside
					for (const [radius, alpha] of [
						[0.5, 0.15],
						[0.3, 0.35],
						[0.12, 1],
					]) {
						ctx.globalAlpha = alpha;
						ctx.beginPath();
						ctx.arc(0, 0, radius, 0, 2 * Math.PI);
						ctx.fill();
					}
				},
			},
		},
		// #region collapse
		behaviors: [fade(0.3, 1)],
		// #endregion
		lighting: null,
	});
	// #endregion
};
