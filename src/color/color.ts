import { formatRgb } from "culori/fn";

import { PartyJSError } from "../errors";
import { toOklab } from "./culori";

/**
 * A color representation in the Oklab color space.
 */
export interface Color {
	l: number;
	a: number;
	b: number;
	alpha: number;
}

/**
 * Produces a Oklab color instance from the given color string.
 *
 * Does nothing if the argument is already an Oklab color.
 */
export function color(input: string | Color): Color {
	if (typeof input !== "string") return input;
	const parsed = toOklab(input);
	if (!parsed) {
		throw new PartyJSError(`invalid color "${input}"`);
	}
	return {
		l: parsed.l,
		a: parsed.a,
		b: parsed.b,
		alpha: parsed.alpha ?? 1,
	};
}

/**
 * Converts an Oklab color to a CSS color string suitable for the canvas.
 *
 * This deliberately serializes to legacy rgb/rgba syntax for compatibility.
 */
export function toCssColor(color: Color): string {
	return formatRgb({ mode: "oklab", ...color });
}
