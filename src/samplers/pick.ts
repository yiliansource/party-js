import { PartyJSError } from "../errors";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler to choose values from an array with (optionally) weighted values.
 *
 * @param arr The array to pick from.
 * @param weights The (optional) non-negative weights of the values, with positive sum.
 *
 */
export function pick<T>(arr: T[], weights?: number[]): SamplerFn<T> {
	if (arr.length === 0)
		throw new PartyJSError("no values were provided to pick from");

	if (weights === undefined) {
		return (ctx) => arr[Math.floor(ctx.rng() * arr.length)];
	} else {
		if (arr.length !== weights.length)
			throw new PartyJSError(
				"numbers of values and weights were mismatched",
			);
		if (weights.some((w) => w < 0))
			throw new PartyJSError("pick weights may not be negative");

		const totalWeight = weights.reduce((a, b) => a + b, 0);
		if (totalWeight === 0)
			throw new PartyJSError("total pick weight may not be zero");

		return (ctx) => {
			const t = ctx.rng() * totalWeight;
			let acc = 0;
			for (let i = 0; i < arr.length; i++) {
				const w = weights[i];
				if (acc + w > t) {
					return arr[i];
				}
				acc += w;
			}

			throw new PartyJSError(
				"something went wrong while randomly picking a weighted value",
			);
		};
	}
}
