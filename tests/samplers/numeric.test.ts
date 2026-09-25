import { describe, expect, test } from "bun:test";

import { createRng } from "../../src/random/rng";
import { normal, range } from "../../src/samplers/numeric";
import { sampledMeanStdDev, sampledMinMax } from "../helpers";
import { createTestCtx } from "./helpers";

describe("range", () => {
	test("output stays within [min, max]", () => {
		const [min, max] = [2, 9];
		const rng = createRng(7);
		const sampler = range(min, max);
		const { min: sampledMin, max: sampledMax } = sampledMinMax(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => v,
		);
		expect(sampledMin).toBeGreaterThanOrEqual(min);
		expect(sampledMax).toBeLessThanOrEqual(max);
	});

	test("output is approx. uniform", () => {
		const rng = createRng(4);
		const sampler = range(1, 5);
		const { mean } = sampledMeanStdDev(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => v,
		);
		expect(mean).toBeCloseTo(3, 2);
	});
});

describe("normal", () => {
	test("output is approx. normal", () => {
		const [mean, stdDev] = [5, 1];
		const rng = createRng(9);
		const sampler = normal(mean, stdDev);
		const { mean: sampledMean, stdDev: sampledStdDev } = sampledMeanStdDev(
			100_000,
			() => sampler(createTestCtx(rng)),
			(v) => v,
		);
		expect(sampledMean).toBeCloseTo(mean, 2);
		expect(sampledStdDev).toBeCloseTo(stdDev, 2);
	});
});
