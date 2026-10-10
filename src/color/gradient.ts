import { PartyJSError } from "../errors";
import * as scalar from "../math/scalar";
import { type Color, color } from "./color";
import * as oklch from "./oklch";

/**
 * A color at a specific position along a gradient, to be used with the {@link gradient | gradient()}
 * sampler when the colors should not be spaced evenly.
 *
 * Because {@link gradient | gradient()} chooses a (uniformly) random position along it for each particle,
 * the spacing of the stops determines how common a color is: the wider the gap between two stops, the more
 * particles get a color that is sampled between those stops.
 *
 * Stops can be listed in any order, and two stops at the same offset create a hard edge instead of a blend.
 *
 * @summary A color at a chosen position along a gradient.
 *
 * @example
 * ```ts
 * // Mostly pinks, with a short blend into gold at the end.
 * gradient([
 *     { offset: 0, color: "#ff5a5f" },
 *     { offset: 0.8, color: "#ff8fa3" },
 *     { offset: 1, color: "#ffb400" },
 * ]);
 * ```
 * @group Samplers
 */
export interface GradientStop {
	/**
	 * The position of the stop, from 0 (the start of the gradient) to 1 (the end).
	 * Values outside this range throw a {@link PartyJSError}.
	 */
	offset: number;
	/**
	 * The color at this position. Accepts anything {@link color | color()} accepts.
	 */
	color: string | Color;
}

export type Gradient = { offset: number; color: Color }[];

const isGradientStopArray = (
	input: (string | Color)[] | GradientStop[],
): input is GradientStop[] => {
	const first = input[0];
	return typeof first !== "string" && "offset" in first;
};

export function createGradient(
	input: (string | Color)[] | GradientStop[],
): Gradient {
	if (input.length === 0) {
		throw new PartyJSError("gradient requires at least one color");
	}

	if (isGradientStopArray(input)) {
		for (const { offset } of input) {
			if (offset < 0 || offset > 1) {
				throw new PartyJSError(
					`gradient stop offset ${offset} is out of range [0, 1]`,
				);
			}
		}

		return input
			.map((stop) => ({
				offset: stop.offset,
				color: color(stop.color),
			}))
			.sort((a, b) => a.offset - b.offset);
	}

	const last = input.length - 1;
	return input.map((c, i) => ({
		offset: last === 0 ? 0 : i / last,
		color: color(c),
	}));
}

export function evaluateGradient(gradient: Gradient, t: number): Color {
	if (gradient.length === 1) return gradient[0].color;

	const clamped = scalar.clamp01(t);
	let i = 0;
	while (i < gradient.length - 2 && gradient[i + 1].offset < clamped) i++;

	const a = gradient[i];
	const b = gradient[i + 1];
	const span = b.offset - a.offset;
	const localT = span === 0 ? 0 : (clamped - a.offset) / span;

	return oklch.lerpOklch(a.color, b.color, localT);
}
