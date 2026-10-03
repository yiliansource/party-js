import { fade, scale } from "../behavior";
import type { Color } from "../color";
import { fromPolar } from "../color/oklch";
import { emitFrom, rectFromElement } from "../emitter";
import { fromAxisAngle, type Quat } from "../math/quat";
import { lerp } from "../math/scalar";
import { unitZ, type Vec3 } from "../math/vec3";
import { createRng } from "../random/rng";
import {
	cone,
	evaluate,
	pick,
	range,
	type Sampler,
	type SamplerContext,
	type SamplerFn,
} from "../samplers";
import { createEffect, type Effect } from "./effect";

export interface SparkleOptions {
	count?: Sampler<number>;
	startVelocity?: Sampler<number>;
	size?: Sampler<number>;
	lifetime?: Sampler<number>;
}

const SPARKLE_DEFAULTS = {
	count: range(20, 40),
	startVelocity: range(150, 250),
	size: range(16, 22),
	lifetime: range(0.5, 1),
} satisfies Required<SparkleOptions>;

export function sparkles(
	element: HTMLElement,
	options: SparkleOptions = {},
): Effect {
	const o = {
		...SPARKLE_DEFAULTS,
		...options,
	};

	const origin: Vec3 = {
		x: element.offsetLeft + element.clientWidth / 2,
		y: element.offsetTop + element.clientHeight / 2,
		z: 0,
	};
	const shape = rectFromElement(element, origin);

	const rng = createRng();
	const resolveCtx: SamplerContext = { rng, index: 0 };

	const count = Math.round(evaluate(o.count, resolveCtx));

	return createEffect({
		origin,
		emitterOptions: {
			schedule: {
				duration: 1 / 60,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count }],
			},
			rng: createRng(),
			particleInit: {
				position: emitFrom(shape),
				velocity: cone(0, 180, o.startVelocity),
				orientation: randomZRotation(),
				angularVelocity: randomZSpin(),
				size: o.size,
				lifetime: o.lifetime,
				color: randomSparkleColor(),
				shape: pick([{ type: "star" }]),
			},
			behaviors: [scale(0.3, 0), fade(0, 0.5)],
		},
	});
}

export function randomSparkleColor(): SamplerFn<Color> {
	return (ctx) =>
		fromPolar({ l: lerp(0.5, 0.7, ctx.rng()), c: 0.15, h: 70 }, 1);
}

export function randomZSpin(): SamplerFn<Vec3> {
	return (ctx) => ({ x: 0, y: 0, z: lerp(360, 720, ctx.rng()) });
}

export function randomZRotation(): SamplerFn<Quat> {
	return (ctx) => fromAxisAngle(unitZ, ctx.rng() * Math.PI * 2);
}
