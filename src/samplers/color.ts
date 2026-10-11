import type { Color } from "../color";
import {
	createGradient,
	evaluateGradient,
	type GradientStop,
} from "../color/gradient";
import { fromPolar } from "../color/oklch";
import { invalidOption, PartyJSError } from "../errors";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler that picks a random color from a gradient.
 *
 * Each particle gets a random position along the gradient, with every position being equally likely. This means
 * that the colors appear in the proportions the gradient gives them. Plain colors are spaced evenly, and one
 * can use {@link GradientStop | stops} to give some colors a higher chance than others.
 *
 * @param colors - The colors, evenly spaced, or explicit stops.
 *
 * @throws {@link PartyJSError} If no colors or stops are given, if a stop's offset is outside `[0, 1]`, or if
 * a color string is invalid.
 *
 * @summary Picks random colors from a gradient.
 *
 * @group Samplers
 */
export function gradient(
	colors: (string | Color)[] | GradientStop[],
): SamplerFn<Color> {
	const g = createGradient(colors);
	return (ctx) => evaluateGradient(g, ctx.rng());
}

/**
 * Options for {@link randomHue | randomHue()}.
 *
 * @summary The lightness, chroma and opacity of random-hue colors.
 *
 * @group Samplers
 */
export interface RandomHueOptions {
	/**
	 * Lightness, from 0 (black) to 1 (white).
	 */
	l: number;
	/**
	 * Chroma: how intense the colors are, from 0 (gray) upwards. Around 0.1-0.2 gives vivid colors, while very
	 * high values cannot be shown on a screen and will be clipped.
	 */
	c: number;
	/**
	 * Opacity, from 0 (transparent) to 1 (opaque).
	 *
	 * @defaultValue 1
	 */
	alpha?: number;
}

/**
 * Creates a sampler for colors of the same lightness and intensity, with a random hue.
 *
 * Because Oklch is perceptually uniform, all hues come out equally bright, which makes for even, rainbow-like mixes.
 *
 * @param options - The lightness, chroma and opacity shared by all colors.
 *
 * @throws {@link PartyJSError} If the supplied chroma is negative.
 *
 * @summary Picks colors with a random hue.
 *
 * @see https://oklch.com
 *
 * @example
 * ```ts
 * color: randomHue({ l: 0.7, c: 0.15 }),
 * ```
 *
 * @group Samplers
 */
export function randomHue(options: RandomHueOptions): SamplerFn<Color> {
	const { l, c, alpha = 1 } = options;
	if (c < 0) throw invalidOption("randomHue()'s chroma", "at least 0", c);
	return (ctx) => fromPolar({ l, c, h: ctx.rng() * 360 }, alpha);
}
