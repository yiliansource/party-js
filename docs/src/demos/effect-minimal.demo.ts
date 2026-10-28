// #region import
import { cone, createEffect, range } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ event }) => {
	// #region demo
	createEffect({
		origin: { x: event.pageX, y: event.pageY },
		schedule: { bursts: [{ count: 20 }] },
		particleInit: {
			velocity: cone(90, 180, range(100, 300)),
			size: 8,
			color: "#ff5a5f",
			shape: { type: "circle" },
			lifetime: 1,
		},
	});
	// #endregion
};
