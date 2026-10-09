import { PartyJSError } from "../errors";
import { parse } from "./parse";

/**
 * A color in the Oklab color space, which party.js uses internally because it is perceptually uniform.
 * Gradients blend evenly, and lighting changes brightness without shifting the hue.
 *
 * You rarely need to build one by hand: You can pass a CSS color string to
 * {@link color | color()}, or anywhere that accepts colors, instead.
 *
 * @summary A color in the Oklab color space.
 *
 * @see https://bottosson.github.io/posts/oklab/
 *
 * @group Utilities
 */
export interface Color {
	/**
	 * Perceived lightness, from 0 (black) to 1 (white).
	 */
	l: number;
	/**
	 * Position on the green (negative) to red (positive) axis, about -0.3 to 0.3 for screen colors.
	 */
	a: number;
	/**
	 * Position on the blue (negative) to yellow (positive) axis, about -0.3 to 0.3 for screen colors.
	 */
	b: number;
	/**
	 * Opacity, from 0 (transparent) to 1 (opaque).
	 */
	alpha: number;
}

/**
 * Converts a CSS color string to a {@link Color}.
 *
 * Accepts hex colors (`#f00`, `#ff5a5f`, `#ff000080`) and the `rgb()`/`rgba()`,
 * `hsl()`/`hsla()`, `oklab()` and `oklch()` functions. A {@link Color} passed in is returned unchanged.
 *
 * Note that named colors are **not** supported, to minimize bundle size. In particular, `transparent`
 * is not a valid color input.
 *
 * @param input - A CSS color string, or an existing color.
 *
 * @returns The Oklab color.
 *
 * @throws {@link PartyJSError} If the string isn't a supported color.
 *
 * @summary Converts a CSS color string to an Oklab color.
 *
 * @example
 * ```ts
 * const cornflowerblue = color("#6495ed");
 * ```
 *
 * @group Utilities
 */
export function color(input: string | Color): Color {
	if (typeof input !== "string") return input;
	const parsed = parse(input);
	if (!parsed) throw new PartyJSError(`invalid color "${input}"`);
	return parsed;
}
