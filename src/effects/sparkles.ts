import { drag, gravity, scale, twinkle } from "../behavior";
import { type Color, color } from "../color";
import { lerp } from "../math/scalar";
import { unitZ } from "../math/vec3";
import {
	cone,
	evaluateSampler,
	gradient,
	randomOrientation,
	randomSpin,
	range,
	type Sampler,
} from "../samplers";
import { burstFrom } from "./burst";
import { type BaseEffectOptions, createEffect, type Effect } from "./effect";
import { pickOrSampler, withDefaults } from "./options";
import type { EffectTarget } from "./target";

/**
 * Options for {@link sparkles | sparkles()}.
 *
 * @summary How many sparkles to emit, and their color, size, speed and lifetime.
 *
 * @group Effects
 */
export interface SparklesOptions extends BaseEffectOptions {
	/**
	 * How many sparkles are emitted in total. They're split into four quick bursts over the first 0.3 seconds, so
	 * the sparkles don't all appear at once. Sampled once, and rounded to the nearest integer.
	 *
	 * @defaultValue range(20, 40)
	 */
	count?: Sampler<number>;
	/**
	 * How fast sparkles burst outwards, in px/s. Drag slows them down quickly, after which they hover and settle.
	 * Sampled for each sparkle.
	 *
	 * @defaultValue range(250, 480)
	 */
	startVelocity?: Sampler<number>;
	/**
	 * The size of the largest sparkles, in pixels. Most sparkles are smaller: each one is scaled down by a random
	 * factor between 0.2 and 1, with small factors being far more likely, so a few big sparkles stand out among
	 * many small ones. Sampled for each sparkle.
	 *
	 * @defaultValue 24
	 */
	size?: Sampler<number>;
	/**
	 * How long the sparkles live, in seconds. Sampled for each sparkle.
	 *
	 * @defaultValue range(0.7, 1.4)
	 */
	lifetime?: Sampler<number>;
	/**
	 * The colors the sparkles can take on. An array of color strings is converted with
	 * {@link color | color()} right away, and a random one is picked for each sparkle. A sampler is
	 * evaluated for each sparkle instead.
	 *
	 * Sparkles aren't affected by lighting, so their colors appear exactly as given, except while they glint.
	 *
	 * @defaultValue gradient(["oklch(0.7 0.15 70)", "oklch(0.95 0.15 70)"])
	 */
	colors?: string[] | Sampler<string | Color>;
}

const SPARKLE_DEFAULTS = {
	count: range(20, 40),
	startVelocity: range(250, 480),
	size: 24,
	lifetime: range(0.7, 1.4),
	colors: gradient(["oklch(0.7 0.15 70)", "oklch(0.95 0.15 70)"]),
} satisfies Required<Omit<SparklesOptions, keyof BaseEffectOptions>>;

const BURSTS = 4;
const BURST_INTERVAL = 0.1;
const MIN_SIZE_FACTOR = 0.2;

/**
 * Bursts twinkling, four-pointed stars, golden by default, out of the specified target, in all directions.
 *
 * The sparkles appear in four quick bursts from the middle of the target, each spread evenly around it. They shoot
 * outwards, slow down quickly and hover, settling slightly downwards while they turn slowly. Occasionally each
 * sparkle catches the light: it briefly grows and flashes towards white, see {@link twinkle | twinkle()}. Most
 * sparkles are small, with a few big ones among them. They pop in almost instantly and shrink away over their
 * last quarter of a second.
 *
 * @summary Bursts twinkling golden sparkles out in all directions.
 *
 * @param target - The target the sparkles burst out of. Its position and size are read once, when the effect starts.
 * @param options - Overrides of the default options. See {@link SparklesOptions} for all fields.
 * @returns A handle to the running effect.
 *
 * @example
 * ```ts
 * button.addEventListener("click", () => sparkles(button, { count: 12 }));
 * ```
 *
 * @group Effects
 */
export function sparkles(
	target: EffectTarget,
	options?: SparklesOptions,
): Effect {
	const o = withDefaults(SPARKLE_DEFAULTS, options);

	const { rng, ctx, origin, position } = burstFrom(target, o);

	const total = Math.round(evaluateSampler(o.count, ctx));

	return createEffect({
		origin,
		schedule: {
			bursts: Array.from({ length: BURSTS }, (_, i) => ({
				time: i * BURST_INTERVAL,
				count: Math.floor((total + i) / BURSTS),
			})),
		},
		rng,
		particleInit: {
			position,
			velocity: cone(0, 180, o.startVelocity),
			orientation: randomOrientation(unitZ),
			angularVelocity: randomSpin(30, 90, unitZ),
			size: (ctx) =>
				evaluateSampler(o.size, ctx) *
				lerp(MIN_SIZE_FACTOR, 1, ctx.rng() ** 2.5),
			lifetime: o.lifetime,
			color: pickOrSampler(o.colors, color),
			shape: { type: "star", points: 4, innerRadius: 0.22 },
		},
		behaviors: [gravity(60), drag(5), scale(0.05, 0.25), twinkle()],
		lighting: null,
		reducedMotion: o.reducedMotion,
		canvas: o.canvas,
	});
}
