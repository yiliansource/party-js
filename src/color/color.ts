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
