import type { Color } from "../color";
import {
	createGradient,
	evaluateGradient,
	type GradientStop,
} from "../color/gradient";
import { fromPolar } from "../color/oklch";
import { PartyJSError } from "../errors";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler for picking a color from a gradient.
 */
export function gradient(
	colors: (string | Color)[] | GradientStop[],
): SamplerFn<Color> {
	const g = createGradient(colors);
	return (ctx) => evaluateGradient(g, ctx.rng());
}

export interface RandomHueOptions {
	l: number;
	c: number;
	alpha?: number;
}

/**
 * Creates a sampler for adding a random hue to a partial Oklch color that produces an Oklab color.
 */
export function randomHue(options: RandomHueOptions): SamplerFn<Color> {
	const { l, c, alpha = 1 } = options;
	if (c < 0) throw new PartyJSError(`chroma must be non-negative, got ${c}`);
	return (ctx) => fromPolar({ l, c, h: ctx.rng() * 360 }, alpha);
}
