import { drag, fade, gravity, scale } from "../behavior";
import { type Color, color } from "../color";
import type { Vec3 } from "../math/vec3";
import { createLighting } from "../render";
import {
	evaluateSampler,
	randomHue,
	randomOrientation,
	randomSpin,
	range,
	type Sampler,
	type SamplerFn,
} from "../samplers";
import type { ParticleShape } from "../shapes";
import { burstFrom } from "./burst";
import { type BaseEffectOptions, createEffect, type Effect } from "./effect";
import { pickOrSampler, withDefaults } from "./options";
import type { EffectTarget } from "./target";

/**
 * Options for {@link confetti | confetti()}.
 *
 * @summary Customization of the built-in confetti effect.
 *
 * @group Effects
 */
export interface ConfettiOptions extends BaseEffectOptions {
	/**
	 * How many pieces of confetti are emitted simultaneously at the start of the effect.
	 * Sampled once and rounded to the nearest integer.
	 *
	 * @defaultValue range(15, 30)
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
	 * Most confetti flies close to `angle`, and becomes rarer and slower towards the edges of the cone, so the burst
	 * shoots out as a jet rather than spraying evenly. Sampled once when the effect starts, so all confetti shares
	 * the value.
	 *
	 * @defaultValue 50
	 */
	spread?: Sampler<number>;
	/**
	 * How fast confetti starts out, in px/s. Its direction comes from `angle` and `spread`, and confetti towards
	 * the edges of the cone starts out up to 45% slower. Drag slows the confetti down quickly, so it travels roughly
	 * `startVelocity * drag / gravity` pixels before it starts to fall.
	 * Sampled for each piece of confetti.
	 *
	 * @defaultValue range(800, 1500)
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
	 * @defaultValue [{ type: "circle" }, { type: "square", cornerRadius: 0.2 }, { type: "square", aspectRatio: 0.2, cornerRadius: 0.05 }]
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
	 * Lower values make confetti drift down more slowly, and also keep it from flying as far. Unlike the
	 * {@link drag | drag()} behavior, this is a speed, not a rate. Sampled for each piece of confetti, so a range
	 * lets the cloud spread out as it falls.
	 *
	 * @defaultValue range(130, 220)
	 */
	drag?: Sampler<number>;
}

/**
 * How much drag confetti feels moving edge-on, relative to face-on. Makes it glide and sway as it tumbles.
 */
const EDGE_RATIO = 0.4;

/**
 * How much slower confetti at the very edge of the cone starts out than confetti flying along `angle`.
 */
const EDGE_SLOWDOWN = 0.45;

const CONFETTI_DEFAULTS = {
	count: range(15, 30),
	angle: 90,
	spread: 50,
	startVelocity: range(800, 1500),
	size: range(6, 16),
	lifetime: range(2, 4),
	colors: randomHue({ l: 0.65, c: 0.15 }),
	shapes: [
		{ type: "circle" },
		{
			type: "square",
			cornerRadius: 0.2,
		},
		{
			type: "square",
			aspectRatio: 0.2,
			cornerRadius: 0.05,
		},
	],
	gravity: 800,
	drag: range(130, 220),
} satisfies Required<Omit<ConfettiOptions, keyof BaseEffectOptions>>;

/**
 * Fires a burst of confetti in a cone, upwards by default, from the specified target.
 *
 * The confetti shoots out of the middle of the target, fast and mostly along `angle`. Drag slows it down within
 * a fraction of a second, and it then flutters down slowly like paper, swaying as it tumbles. It grows to its full
 * size over its first 0.03 seconds, fades out over its last second, and is lit with a glossy sheen (`peak: 1.5`).
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

	const { rng, ctx, origin, position } = burstFrom(target, o);

	const angle = evaluateSampler(o.angle, ctx);
	const spread = evaluateSampler(o.spread, ctx);
	const gravityStrength = evaluateSampler(o.gravity, ctx);

	return createEffect({
		origin,
		schedule: {
			bursts: [{ count: o.count }],
		},
		rng,
		particleInit: {
			position,
			velocity: jet(angle, spread, o.startVelocity),
			orientation: randomOrientation(),
			angularVelocity: randomSpin(180, 360),
			size: o.size,
			lifetime: o.lifetime,
			color: pickOrSampler(o.colors, color),
			shape: pickOrSampler(o.shapes),
		},
		behaviors: [
			gravity(gravityStrength),
			drag(
				(ctx) => gravityStrength / evaluateSampler(o.drag, ctx),
				EDGE_RATIO,
			),
			scale(0.03, 0),
			fade(0, 1),
		],
		lighting: createLighting({ ambient: 0.5, peak: 1.5 }),
		reducedMotion: o.reducedMotion,
		canvas: o.canvas,
	});
}

/**
 * Like {@link cone | cone()}, but shaped like a jet: directions cluster around `angle`, and particles further
 * from it are slower. A burst then forms a narrow, fast core with sparse, slow flanks, rather than an evenly
 * filled fan whose edges fly as far as its center.
 */
function jet(
	angle: number,
	deviation: number,
	speed: Sampler<number>,
): SamplerFn<Vec3> {
	return (ctx) => {
		// triangular distribution in [-1, 1], most likely around 0
		const t = ctx.rng() + ctx.rng() - 1;
		const theta = ((angle + t * deviation) * Math.PI) / 180;
		const r = evaluateSampler(speed, ctx) * (1 - EDGE_SLOWDOWN * t * t);
		return { x: Math.cos(theta) * r, y: Math.sin(theta) * r, z: 0 };
	};
}
