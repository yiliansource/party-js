import { fade, scale } from "../behavior";
import { type Color, color } from "../color";
import { emitFrom } from "../emitter";
import { fromAxisAngle, type Quat } from "../math/quat";
import { lerp } from "../math/scalar";
import { unitZ, type Vec3 } from "../math/vec3";
import { createRng } from "../random/rng";
import {
	cone,
	gradient,
	pick,
	range,
	type Sampler,
	type SamplerFn,
} from "../samplers";
import { withDefaults } from "./defaults";
import {
	createEffect,
	type Effect,
	type EffectTarget,
	resolveTarget,
} from "./effect";
import type { ReducedMotion } from "./motion";

/**
 * Options for {@link sparkles | sparkles()}.
 *
 * @summary How many sparkles to emit, and their color, size, speed and lifetime.
 *
 * @group Effects
 */
export interface SparkleOptions {
	/**
	 * How many sparkles are emitted at the start of the effect. Sampled once, and rounded to the nearest integer.
	 *
	 * @defaultValue range(20, 40)
	 */
	count?: Sampler<number>;
	/**
	 * How fast sparkles fly outwards, in px/s. Sampled for each sparkle.
	 *
	 * @defaultValue range(150, 250)
	 */
	startVelocity?: Sampler<number>;
	/**
	 * The size of the sparkles, in pixels. Sampled for each sparkle.
	 *
	 * @defaultValue range(16, 22)
	 */
	size?: Sampler<number>;
	/**
	 * How long the sparkles live, in seconds. Sampled for each sparkle.
	 *
	 * @defaultValue range(0.5, 1)
	 */
	lifetime?: Sampler<number>;
	/**
	 * The colors the sparkles can take on. An array of color strings is converted with
	 * {@link color | color()} right away, and a random one is picked for each sparkle. A sampler is
	 * evaluated for each sparkle instead.
	 *
	 * Sparkles aren't affected by lighting, so their colors appear exactly as given.
	 *
	 * @defaultValue gradient(["oklch(0.7 0.15 70)", "oklch(0.95 0.15 70)"])
	 */
	colors?: string[] | Sampler<string | Color>;
	/**
	 * What happens when the user has asked their system for reduced motion: `"skip"` doesn't play the sparkles,
	 * `"play"` plays them anyway. See {@link ReducedMotion} for more information.
	 *
	 * Without this option, the default set with {@link setDefaultReducedMotion | setDefaultReducedMotion()} is used,
	 * which is `"skip"` unless you changed it.
	 */
	reducedMotion?: ReducedMotion;
}

const SPARKLE_DEFAULTS = {
	count: range(20, 40),
	startVelocity: range(150, 250),
	size: range(16, 22),
	lifetime: range(0.5, 1),
	colors: gradient(["oklch(0.7 0.15 70)", "oklch(0.95 0.15 70)"]),
} satisfies Required<Omit<SparkleOptions, "reducedMotion">>;

/**
 * Bursts spinning stars, golden by default, out of the specified target, in all directions.
 *
 * The sparkles are spread evenly around the target and fly outwards in straight lines, unaffected by gravity.
 * They always face the viewer while spinning, grow to their full size over their first 0.3 seconds, and fade
 * out over their last half second. Each sparkle only lives for 0.5 to 1 second.
 *
 * @summary Bursts spinning golden stars out in all directions.
 *
 * @param target - The target the sparkles burst out of. Its position and size are read once, when the effect starts.
 * @param options - Overrides of the default options. See {@link SparkleOptions} for all fields.
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
	options?: SparkleOptions,
): Effect {
	const o = withDefaults(SPARKLE_DEFAULTS, options);

	const rng = createRng();
	const { origin, shape } = resolveTarget(target);

	return createEffect({
		origin,
		schedule: {
			bursts: [{ count: o.count }],
		},
		rng,
		particleInit: {
			position: emitFrom(shape),
			velocity: cone(0, 180, o.startVelocity),
			orientation: randomZRotation(),
			angularVelocity: randomZSpin(360, 720),
			size: o.size,
			lifetime: o.lifetime,
			color: Array.isArray(o.colors)
				? pick(o.colors.map(color))
				: o.colors,
			shape: { type: "star" },
		},
		behaviors: [scale(0.3, 0), fade(0, 0.5)],
		lighting: null,
		reducedMotion: o.reducedMotion,
	});
}

function randomZSpin(min: number, max: number): SamplerFn<Vec3> {
	return (ctx) => {
		const direction = ctx.rng() < 0.5 ? -1 : 1;
		return { x: 0, y: 0, z: direction * lerp(min, max, ctx.rng()) };
	};
}

function randomZRotation(): SamplerFn<Quat> {
	return (ctx) => fromAxisAngle(unitZ, ctx.rng() * Math.PI * 2);
}
