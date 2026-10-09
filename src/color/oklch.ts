import * as scalar from "../math/scalar";
import type { Color } from "./color";

/**
 * A color in the Oklch space.
 */
export interface Oklch {
	l: number;
	c: number;
	h: number;
}

// below this chroma, a color's hue is treated as powerless.
const ACHROMATIC = 4e-6;

/**
 * Converts an Oklab color to its polar form, Oklch.
 *
 * Unlike the CSS reference implementation, which treats the hue of a color with chroma <= 0.000004 as powerless (`NaN`),
 * this always returns the "raw" atan2 angle. This results in an "arbitrary" hue for achromatic and near-achromatic colors.
 *
 * @see https://bottosson.github.io/posts/oklab/
 * @see https://drafts.csswg.org/css-color-4/conversions.js
 */
export function toPolar(c: Color): Oklch {
	return {
		l: c.l,
		c: Math.hypot(c.a, c.b),
		h: (Math.atan2(c.b, c.a) * scalar.rad2deg + 360) % 360,
	};
}

/**
 * Converts an Oklch color back to Oklab, the inverse of {@link toPolar}.
 *
 * Hues outside [0, 360) are accepted, since the conversion is periodic.
 *
 * @see https://bottosson.github.io/posts/oklab/
 * @see https://drafts.csswg.org/css-color-4/conversions.js
 */
export function fromPolar(p: Oklch, alpha: number): Color {
	const rad = p.h * scalar.deg2rad;
	return {
		l: p.l,
		a: p.c * Math.cos(rad),
		b: p.c * Math.sin(rad),
		alpha,
	};
}

/**
 * Interpolates between two hues in degrees along the shorter arc of the hue circle, matching CSS's default `shorter` hue interpolation method.
 *
 * Expects both hues in `[0, 360)`. For t in `[0, 1]`, the result also lies in `[0, 360)`.
 *
 * When the hues are exactly 180° apart, both arcs are equally short, and this implementation always takes the decreasing arc.
 * This differs from CSS, which would instead break the tie by direction. For instance: for hues 0 and 180 at `t = 0.5`,
 * CSS returns 90, while this returns 270.
 *
 * @see https://drafts.csswg.org/css-color/#hue-interpolation
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/hue-interpolation-method
 */
export function lerpHue(a: number, b: number, t: number): number {
	const diff = ((b - a + 540) % 360) - 180;
	return (a + diff * t + 360) % 360;
}

/**
 * Interpolates between two Oklab colors in Oklch, taking the shorter way around the hue circle, see {@link lerpHue}.
 *
 * A color without meaningful chroma (white, black, grays) has no real hue, so it takes on the other color's hue instead.
 * This matches how CSS handles powerless hues, and keeps a gradient from a neutral color from passing
 * through unrelated hues.
 *
 * @see https://drafts.csswg.org/css-color-4/#powerless
 */
export function lerpOklch(a: Color, b: Color, t: number): Color {
	const pa = toPolar(a);
	const pb = toPolar(b);

	const ha = pa.c > ACHROMATIC ? pa.h : pb.h;
	const hb = pb.c > ACHROMATIC ? pb.h : ha;

	return fromPolar(
		{
			l: scalar.lerp(pa.l, pb.l, t),
			c: scalar.lerp(pa.c, pb.c, t),
			h: lerpHue(ha, hb, t),
		},
		scalar.lerp(a.alpha, b.alpha, t),
	);
}
