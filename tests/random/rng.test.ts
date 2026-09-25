import { describe, expect, test } from "bun:test";

import { createRng } from "../../src/random/rng";
import { sampledMeanStdDev, sampledMinMax } from "../helpers";

describe("createRng", () => {
	test("unseeded instances produce different sequences", () => {
		// this has an astronomically unlikely chance of collision
		const a = createRng();
		const b = createRng();
		const seqA = Array.from({ length: 20 }, () => a());
		const seqB = Array.from({ length: 20 }, () => b());
		expect(seqA).not.toEqual(seqB);
	});

	test("same seed produces the same sequence", () => {
		const a = createRng(42);
		const b = createRng(42);
		const seqA = Array.from({ length: 20 }, () => a());
		const seqB = Array.from({ length: 20 }, () => b());
		expect(seqA).toEqual(seqB);
	});

	test("different seeds produce different sequences", () => {
		const a = createRng(1);
		const b = createRng(2);
		const seqA = Array.from({ length: 20 }, () => a());
		const seqB = Array.from({ length: 20 }, () => b());
		expect(seqA).not.toEqual(seqB);
	});

	test("unseeded output stays within [0, 1)", () => {
		const rng = createRng();
		const { min, max } = sampledMinMax(100_000, rng, (v) => v);
		expect(min).toBeGreaterThanOrEqual(0);
		expect(max).toBeLessThan(1);
	});

	test("seeded output stays within [0, 1)", () => {
		const rng = createRng(7);
		const { min, max } = sampledMinMax(100_000, rng, (v) => v);
		expect(min).toBeGreaterThanOrEqual(0);
		expect(max).toBeLessThan(1);
	});

	test("output is approx. uniform over many draws", () => {
		const rng = createRng(3);
		const { mean } = sampledMeanStdDev(100_000, rng, (v) => v);
		expect(mean).toBeCloseTo(0.5, 2);
	});

	test("consecutive draws are (mostly) different", () => {
		const rng = createRng(9);
		const values = new Set(Array.from({ length: 50 }, rng));
		expect(values.size).toBeGreaterThan(45);
	});
});
