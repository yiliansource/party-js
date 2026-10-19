import {
	createEffect,
	pick,
	randomOrientation,
	randomSpin,
	range,
	scale,
	type SamplerFn,
	type Vec3,
} from "party-js";
import type { Demo } from "./types";

const ring =
	(radius: number): SamplerFn<Vec3> =>
	(ctx) => {
		const { index, size } = ctx.batch ?? { index: 0, size: 1 };
		const angle = (2 * Math.PI * index) / size;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
			z: 0,
		};
	};

export const run: Demo = ({ target }) => {
	const rect = target.getBoundingClientRect();

	createEffect({
		origin: {
			x: rect.x + rect.width / 2 + window.scrollX,
			y: rect.y + rect.height / 2 + window.scrollY,
		},
		schedule: { bursts: [{ count: range(10, 20) }] },
		particleInit: {
			position: ring(120),
			velocity: { x: 0, y: 0, z: 0 },
			orientation: randomOrientation(),
			angularVelocity: randomSpin(90, 270),
			size: 16,
			color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
			shape: { type: "circle" },
			lifetime: 2,
		},
		behaviors: [scale(0.1, 0.5)],
	});
};
