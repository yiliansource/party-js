import { describe, expect, test } from "bun:test";

import { createRng } from "../../src/random/rng";
import { pick } from "../../src/samplers/pick";
import { sampledEvery, sampledFrequencies } from "../helpers";
import { createTestCtx } from "./helpers";

describe("pick", () => {
	test("picks an element of the provided values", () => {
		const rng = createRng(4);
		const values = [1, 2, 3, 4, 5];
		const sampler = pick(values);
		const res = sampledEvery(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => values.includes(v),
		);
		expect(res).toEqual({ ok: true });
	});

	test("weighting works with single-element arrays", () => {
		const rng = createRng(1);
		const sampler = pick([1], [3]);
		const n = 100_000;
		const freq = sampledFrequencies(n, () => sampler(createTestCtx(rng)));
		expect(freq.get(1)).toBe(n);
	});

	test("zero weight elements cannot be picked", () => {
		const rng = createRng(11);
		const sampler = pick([1, 2, 3], [1, 0, 1]);
		const freq = sampledFrequencies(100_000, () =>
			sampler(createTestCtx(rng)),
		);
		expect(freq.get(2) ?? 0).toBe(0);
	});

	test("respects weights", () => {
		const rng = createRng(2);
		const sampler = pick([1, 2, 3], [2, 0, 1]);
		const n = 100_000;
		const freq = sampledFrequencies(n, () => sampler(createTestCtx(rng)));

		const totalWeight = 3;
		expect((freq.get(1) ?? 0) / n).toBeCloseTo(2 / totalWeight, 2);
		expect((freq.get(3) ?? 0) / n).toBeCloseTo(1 / totalWeight, 2);
	});

	test("throws when no values provided", () => {
		expect(() => pick([])).toThrow();
	});

	test("throws when array lengths are incompatible", () => {
		expect(() => pick([1, 2, 3], [1, 2])).toThrow();
	});

	test("throws when negative weights", () => {
		expect(() => pick([1, 2, 3], [2, -1])).toThrow();
	});

	test("throws when all weights are zero", () => {
		expect(() => pick([1, 2, 3], [0, 0, 0])).toThrow();
	});
});
