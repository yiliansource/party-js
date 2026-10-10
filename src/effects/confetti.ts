import { drag, fade, gravity, scale } from "../behavior";
import type { Color } from "../color";
import { emitFrom } from "../emitter";
import { createRng } from "../random/rng";
import {
	cone,
	evaluateSampler,
	pick,
	randomHue,
	randomOrientation,
	randomSpin,
	range,
	type Sampler,
	type SamplerContext,
} from "../samplers";
import {
	createEffect,
	type Effect,
	type EffectTarget,
	resolveTarget,
} from "./effect";

/**
 * @group Effects
 */
export interface ConfettiOptions {
	count?: Sampler<number>;
	angle?: Sampler<number>;
	spread?: Sampler<number>;
	startVelocity?: Sampler<number>;
	size?: Sampler<number>;
	lifetime?: Sampler<number>;
	colors?: string[] | Sampler<string | Color>;
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

/**
 * Fires a burst of confetti in an upwards cone from the specified target.
 *
 * @summary Emits a burst of confetti.
 *
 * @param target The target the confetti bursts out of. Its position and size are read once, when the effect starts.
 * @param options Overrides of the default options. See {@link ConfettiOptions} for all fields.
 *
 * @returns A handle to the running effect.
 *
 * @example
 * const effect = confetti(button, { spread: 70 });
 *
 * // e.g. when the component unmounts
 * effect.stop();
 *
 * @group Effects
 */
export function confetti(
	target: EffectTarget,
	options: ConfettiOptions = {},
): Effect {
	const o = {
		...CONFETTI_DEFAULTS,
		...options,
	};

	const rng = createRng();
	const resolveCtx: SamplerContext = { rng, index: 0 };
	const { origin, shape } = resolveTarget(target);

	const angle = evaluateSampler(o.angle, resolveCtx);
	const spread = evaluateSampler(o.spread, resolveCtx);
	const gravityStrength = evaluateSampler(o.gravity, resolveCtx);
	const dragStrength = evaluateSampler(o.drag, resolveCtx);

	return createEffect({
		origin,
		schedule: {
			duration: 1 / 60,
			loops: 1,
			rate: 0,
			bursts: [{ time: 0, count: o.count }],
		},
		rng,
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(angle, spread, o.startVelocity),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(180, 360),
			size: o.size,
			lifetime: o.lifetime,
			color: Array.isArray(o.colors) ? pick(o.colors) : o.colors,
			shape: pick([
				{ type: "square", cornerRadius: 0.2 },
				{ type: "circle" },
			]),
		},
		behaviors: [
			gravity(gravityStrength),
			drag(gravityStrength / dragStrength ** 2),
			scale(0.2, 0),
			fade(0, 1),
		],
	});
}
