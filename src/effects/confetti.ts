import { drag, fade, gravity, scale } from "../behavior";
import { type Color, color } from "../color";
import { type EffectTarget, emissionTarget, emitFrom } from "../emitter";
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
import type { ParticleShape } from "../shapes";
import { withDefaults } from "./defaults";
import { createEffect, type Effect } from "./effect";
import type { ReducedMotion } from "./motion";

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
	 * Sampled once and rounded to the nearest integer.
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
	 * How fast confetti starts out, in px/s. Its direction comes from `angle` and `spread`.
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
	 * The colors that the confetti can take on. If an array of color strings is given, they are converted to
	 * {@link Color} objects via {@link color | color()}, and a random one will be picked for each confetti.
	 * Otherwise, the sampler is evaluated for each piece of confetti.
	 *
	 * @defaultValue randomHue({ l: 0.65, c: 0.15 })
	 */
	colors?: string[] | Sampler<string | Color>;
	/**
	 * The shapes that the confetti can take on. If any array of shapes is given, a random one will be picked
	 * for each confetti. Otherwise, the sampler is evaluated for each piece of confetti.
	 *
	 * @defaultValue [{ type: "square", cornerRadius: 0.2 }, { type: "circle" }]
	 */
	shapes?: ParticleShape[] | Sampler<ParticleShape>;
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
	/**
	 * What happens when the user has asked their system for reduced motion: `"skip"` doesn't play the confetti,
	 * `"play"` plays it anyway. See {@link ReducedMotion} for more information.
	 *
	 * Without this option, the default set with {@link setDefaultReducedMotion | setDefaultReducedMotion()} is used,
	 * which is `"skip"` unless you changed it.
	 */
	reducedMotion?: ReducedMotion;
}

const CONFETTI_DEFAULTS = {
	count: range(20, 40),
	angle: 90,
	spread: 45,
	startVelocity: range(300, 600),
	size: range(6, 16),
	lifetime: range(2, 4),
	colors: randomHue({ l: 0.65, c: 0.15 }),
	shapes: [{ type: "square", cornerRadius: 0.2 }, { type: "circle" }],
	gravity: 800,
	drag: 500,
} satisfies Required<Omit<ConfettiOptions, "reducedMotion">>;

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
 * button.addEventListener("click", () => confetti(button, { spread: 70 }));
 * ```
 *
 * @group Effects
 */
export function confetti(
	target: EffectTarget,
	options?: ConfettiOptions,
): Effect {
	const o = withDefaults(CONFETTI_DEFAULTS, options);

	const rng = createRng();
	const resolveCtx: SamplerContext = { rng, index: 0 };
	const { origin, shape } = emissionTarget(target);

	const angle = evaluateSampler(o.angle, resolveCtx);
	const spread = evaluateSampler(o.spread, resolveCtx);
	const gravityStrength = evaluateSampler(o.gravity, resolveCtx);
	const dragStrength = evaluateSampler(o.drag, resolveCtx);

	return createEffect({
		origin,
		schedule: {
			bursts: [{ count: o.count }],
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
			shape: Array.isArray(o.shapes) ? pick(o.shapes) : o.shapes,
		},
		behaviors: [
			gravity(gravityStrength),
			drag(gravityStrength / dragStrength ** 2),
			scale(0.2, 0),
			fade(0, 1),
		],
		lighting: createLighting({ ambient: 0.5, peak: 1.5 }),
		reducedMotion: o.reducedMotion,
	});
}
