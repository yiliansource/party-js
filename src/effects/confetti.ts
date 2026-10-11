import { drag, fade, gravity, scale } from "../behavior";
import { type Color, color } from "../color";
import { emitFrom } from "../emitter";
import { createRng } from "../random/rng";
import { createLighting } from "../render";
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
 * Options for {@link confetti | confetti()}.
 *
 * @summary Customization of the built-in confetti effect.
 *
 * @group Effects
 */
export interface ConfettiOptions {
	/**
	 * How many pieces of confetti are emitted simultaneously at the start of the effect.
	 *
	 * @defaultValue range(20, 40)
	 */
	count?: Sampler<number>;
	/**
	 * The angle at which the confetti is emitted, measured counter-clockwise from +x in degrees in particle space, so
	 * 0 points right and 90 points up. Sampled once when the effect starts, so all confetti shares the value.
	 *
	 * @defaultValue 90
	 */
	angle?: Sampler<number>;
	/**
	 * How much a confetti's emission angle may differ from `angle`, in degrees, in either direction.
	 * Sampled once when the effect starts, so all confetti shares the value.
	 *
	 * @defaultValue 45
	 */
	spread?: Sampler<number>;
	/**
	 * How fast confetti starts out, in px/s. It's direction comes from `angle` and `spread`.
	 * Sampled for each piece of confetti.
	 *
	 * @defaultValue range(300, 600)
	 */
	startVelocity?: Sampler<number>;
	/**
	 * The initial size of the confetti, in pixels. Sampled for each piece of confetti.
	 *
	 * @defaultValue range(6, 16)
	 */
	size?: Sampler<number>;
	/**
	 * The lifetime of the confetti, in seconds. Sampled for each piece of confetti.
	 *
	 * @defaultValue range(2, 4)
	 */
	lifetime?: Sampler<number>;
	/**
	 * The colors that the particles can take on. If an array of color strings is given, they are converted to
	 * {@link Color} objects via {@link color | color()}, and a random one will be picked for each particle.
	 * Otherwise, the sampler is evaluated for each piece of confetti.
	 *
	 * @defaultValue randomHue({ l: 0.65, c: 0.15 })
	 */
	colors?: string[] | Sampler<string | Color>;
	/**
	 * The strength of gravity affecting the confetti, in px/s².
	 * Sampled once when the effect starts, so all confetti shares the value.
	 *
	 * @defaultValue 800
	 */
	gravity?: Sampler<number>;
	/**
	 * The speed at which falling confetti stops accelerating, in px/s, where drag balances gravity.
	 * Lower values make confetti drift down more slowly. Unlike the {@link drag | drag()} behavior, this
	 * is a speed, not a coefficient. Sampled once when the effect starts, so all confetti shares the value.
	 *
	 * @defaultValue 500
	 */
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
 * Fires a burst of confetti in a cone, upwards by default, from the specified target.
 *
 * The confetti is affected by gravity and drag. It grows to its full size over its first 0.2 seconds, fades
 * out over its last second, and is lit with a glossy sheen (`peak: 1.5`).
 *
 * @summary Emits a burst of confetti.
 *
 * @param target - The target the confetti bursts out of. Its position and size are read once, when the effect starts.
 * @param options - Overrides of the default options. See {@link ConfettiOptions} for all fields.
 * @returns A handle to the running effect.
 *
 * @example
 * ```ts
 * const effect = confetti(button, { spread: 70 });
 *
 * // e.g. when the component unmounts
 * effect.stop();
 * ```
 *
 * @group Effects
 */
export function confetti(
	target: EffectTarget,
	options?: ConfettiOptions,
): Effect {
	const o = {
		...CONFETTI_DEFAULTS,
		...(options ?? {}),
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
			drag(gravityStrength / dragStrength ** 2),
			scale(0.2, 0),
			fade(0, 1),
		],
		lighting: createLighting({ ambient: 0.5, peak: 1.5 }),
	});
}
