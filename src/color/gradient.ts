import { PartyJSError } from "../errors";
import * as scalar from "../math/scalar";
import { type Color, color } from "./color";
import * as oklch from "./oklch";

export interface GradientStop {
	offset: number;
	color: Color;
}

export interface Gradient {
	stops: GradientStop[];
}

function isGradientStop(x: unknown): x is GradientStop {
	return (
		typeof x === "object" &&
		x !== null &&
		"offset" in x &&
		typeof (x as GradientStop).offset === "number" &&
		"color" in x
	);
}

export function createGradient(
	input: (string | Color)[] | GradientStop[],
): Gradient {
	if (input.length === 0) {
		throw new PartyJSError("gradient requires at least one color");
	}

	const flags = input.map(isGradientStop);
	const allStops = flags.every(Boolean);
	const noneStops = flags.every((f) => !f);

	if (!allStops && !noneStops) {
		throw new PartyJSError(
			"gradient input mixes colors and explicit stops",
		);
	}

	if (allStops) {
		const stops = (input as GradientStop[]).map((s) => {
			if (s.offset < 0 || s.offset > 1) {
				throw new PartyJSError(
					`gradient stop offset ${s.offset} is out of range [0, 1]`,
				);
			}
			return { offset: s.offset, color: color(s.color) };
		});
		return { stops: stops.sort((a, b) => a.offset - b.offset) };
	}

	const n = input.length;
	return {
		stops: (input as (string | Color)[]).map((c, i) => ({
			offset: n === 1 ? 0 : i / (n - 1),
			color: color(c),
		})),
	};
}

export function evaluateGradient(gradient: Gradient, t: number): Color {
	const stops = gradient.stops;
	if (stops.length === 1) return stops[0].color;

	const clamped = scalar.clamp01(t);
	let i = 0;
	while (i < stops.length - 2 && stops[i + 1].offset < clamped) i++;

	const a = stops[i];
	const b = stops[i + 1];
	const span = b.offset - a.offset;
	const localT = span === 0 ? 0 : (clamped - a.offset) / span;

	const pa = oklch.toPolar(a.color);
	const pb = oklch.toPolar(b.color);
	return oklch.fromPolar(
		{
			l: scalar.lerp(pa.l, pb.l, localT),
			c: scalar.lerp(pa.c, pb.c, localT),
			h: oklch.lerpHue(pa.h, pb.h, localT),
		},
		scalar.lerp(a.color.alpha, b.color.alpha, localT),
	);
}
