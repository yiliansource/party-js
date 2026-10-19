import {
	cone,
	createEffect,
	fade,
	gravity,
	pick,
	randomOrientation,
	randomSpin,
	range,
	scale,
} from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ event }) => {
	createEffect({
		origin: {
			x: event.pageX,
			y: event.pageY,
		},
		schedule: { bursts: [{ count: range(10, 20) }] },
		particleInit: {
			position: { x: 0, y: 0, z: 0 },
			velocity: cone(90, 30, range(200, 600)),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: range(10, 16),
			color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: 2,
		},
		seed: 42,
		behaviors: [gravity(800), scale(0.1, 0), fade(0, 1)],
	});
};
