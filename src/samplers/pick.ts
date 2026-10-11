import { PartyJSError } from "../errors";
import type { SamplerFn } from "./types";

/**
 * Creates a sampler that picks one of the given values at random, either with equal chances or weighted ones.
 *
 * Weights are relative and don't need to add up to 1: `[3, 1]` will make the first value three times as likely
 * as the second one.
 *
 * @param arr - The values to pick from.
 * @param weights - Optional relative chances, one per value.
 *
 * @throws {@link PartyJSError} If `arr` is empty, if the number of weights doesn't match the number of values,
 * if a weight is negative or if all weights are zero.
 *
 * @summary Picks one of several values at random.
 *
 * @example
 * ```ts
 * // Mostly circles with an occasional star.
 * pick([{ type: "circle" }, { type: "star" }], [4, 1])
 * ```
 *
 * @group Samplers
 */
export function pick<T>(arr: T[], weights?: number[]): SamplerFn<T> {
	if (arr.length === 0)
		throw new PartyJSError("pick() needs at least one value to pick from");

	if (weights === undefined) {
		return (ctx) => arr[Math.floor(ctx.rng() * arr.length)];
	} else {
		if (arr.length !== weights.length)
			throw new PartyJSError(
				`pick() got ${arr.length} values, but ${weights.length} weights`,
			);

		for (let i = 0; i < weights.length; i++) {
			if (weights[i] < 0)
				throw new PartyJSError(
					`pick() weights must be at least 0, got ${weights[i]} at index ${i}`,
				);
		}

		const totalWeight = weights.reduce((a, b) => a + b, 0);
		if (totalWeight === 0)
			throw new PartyJSError("pick() weights must not all be zero");

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
				"internal error in pick(), please report this",
			);
		};
	}
}
