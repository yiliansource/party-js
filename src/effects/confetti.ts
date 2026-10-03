import { drag, fade, gravity, scale } from "../behavior";
import { type Color, color } from "../color";
import { emitFrom, rectFromElement } from "../emitter";
import type { Vec3 } from "../math/vec3";
import { createRng } from "../random/rng";
import {
	cone,
	evaluate,
	pick,
	randomHue,
	randomOrientation,
	randomSpin,
	range,
	type Sampler,
	type SamplerContext,
} from "../samplers";
import { createEffect, type Effect } from "./effect";

export interface ConfettiOptions {
	count?: Sampler<number>;
	angle?: Sampler<number>;
	spread?: Sampler<number>;
	startVelocity?: Sampler<number>;
	size?: Sampler<number>;
	lifetime?: Sampler<number>;
	colors?: string[] | Sampler<Color>;
	gravity?: Sampler<number>;
	drag?: Sampler<number>;
}

const CONFETTI_DEFAULTS = {
	count: range(20, 40),
	angle: 90,
	spread: 45,
	startVelocity: range(300, 600),
	size: range(6, 16),
	lifetime: range(2, 4),
	colors: randomHue({ l: 0.65, c: 0.15 }),
	gravity: 800,
	drag: 500,
} satisfies Required<ConfettiOptions>;

export function confetti(
	element: HTMLElement,
	options: ConfettiOptions = {},
): Effect {
	const o = {
		...CONFETTI_DEFAULTS,
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

	const angle = evaluate(o.angle, resolveCtx);
	const spread = evaluate(o.spread, resolveCtx);
	const count = Math.round(evaluate(o.count, resolveCtx));
	const gravityStrength = evaluate(o.gravity, resolveCtx);
	const dragStrength = evaluate(o.drag, resolveCtx);

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
				velocity: cone(angle, spread, o.startVelocity),
				orientation: randomOrientation(),
				angularVelocity: randomSpin(180, 360),
				size: o.size,
				lifetime: o.lifetime,
				color: Array.isArray(o.colors)
					? pick(o.colors.map(color))
					: o.colors,
				shape: pick([
					{ type: "square", cornerRadius: 0.2 },
					{ type: "circle" },
				]),
			},
			behaviors: [
				gravity(gravityStrength),
				drag(dragStrength, gravityStrength),
				scale(0.2, 0),
				fade(0, 1),
			],
		},
	});
}
