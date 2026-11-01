import { invalidOption, PartyJSError } from "../errors";
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
		throw invalidOption("pick() values", "a non-empty array", arr);
	if (weights === undefined)
		return (ctx) => arr[Math.floor(ctx.rng() * arr.length)];

	if (weights.length !== arr.length)
		throw invalidOption(
			"pick() weights",
			`one number per value (${arr.length})`,
			weights,
		);
	weights.forEach((weight, i) => {
		if (!(weight >= 0))
			throw invalidOption(`pick() weights[${i}]`, "at least 0", weight);
	});
	const total = weights.reduce((a, b) => a + b, 0);
	if (total === 0)
		throw invalidOption(
			"pick() weights",
			"above 0 for at least one value",
			weights,
		);

	return (ctx) => {
		let t = ctx.rng() * total;
		for (let i = 0; i < arr.length; i++) {
			t -= weights[i];
			if (t < 0) return arr[i];
		}
		// only reachable through floating-point rounding, at the very end of the range
		return arr[arr.length - 1];
	};
}
