import { clamp01 } from "../math/scalar";
import type { Color } from "./color";

// see https://drafts.csswg.org/css-color-4/conversions.js for the gam_sRGB implementation
// uses the output range [0, 255] instead of [0, 1]
const lin2sRGB = (c: number): number => {
	const v = clamp01(c);
	return Math.round(
		(v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055) * 255,
	);
};

/**
 * Formats an Oklab color as a CSS color string.
 *
 * Serializes to legacy rgb/rgba syntax for compatibility. Colors outside the sRGB gamut are clipped per channel, and
 * alpha is rounded to two decimals.
 *
 * Full-precision constants are taken from culori (MIT).
 *
 * @see https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab
 * @see https://github.com/Evercoder/culori
 */
export function format({ l: L, a, b, alpha }: Color): string {
	const l = (L + 0.3963377773761749 * a + 0.2158037573099136 * b) ** 3;
	const m = (L - 0.1055613458156586 * a - 0.0638541728258133 * b) ** 3;
	const s = (L - 0.0894841775298119 * a - 1.2914855480194092 * b) ** 3;

	const red = lin2sRGB(
		4.0767416360759574 * l -
			3.3077115392580616 * m +
			0.2309699031821044 * s,
	);
	const green = lin2sRGB(
		-1.2684379732850317 * l +
			2.6097573492876887 * m -
			0.3413193760026573 * s,
	);
	const blue = lin2sRGB(
		-0.0041960761386756 * l -
			0.7034186179359362 * m +
			1.7076146940746117 * s,
	);

	const opacity = Math.round(clamp01(alpha) * 100) / 100;
	return opacity === 1
		? `rgb(${red}, ${green}, ${blue})`
		: `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
