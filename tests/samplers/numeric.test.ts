import { describe, expect, test } from "bun:test";

import { createRng } from "@/random/rng";
import { normal, range, spread } from "@/samplers/numeric";

import { sampledMeanStdDev, sampledMinMax } from "../helpers";
import { makeTestCtx } from "./helpers";

describe("range", () => {
	test("output stays within [min, max]", () => {
		const [min, max] = [2, 9];
		const rng = createRng(7);
		const sampler = range(min, max);
		const { min: sampledMin, max: sampledMax } = sampledMinMax(
			100_000,
			() => sampler(makeTestCtx(rng)),
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
			() => sampler(makeTestCtx(rng)),
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
			() => sampler(makeTestCtx(rng)),
			(v) => v,
		);
		expect(sampledMean).toBeCloseTo(mean, 2);
		expect(sampledStdDev).toBeCloseTo(stdDev, 2);
	});
});

describe("spread", () => {
	test("output is in [center-deviation, center+deviation]", () => {
		const [center, deviation] = [30, 20];
		const rng = createRng(3);
		const sampler = spread(center, deviation);
		const { min, max } = sampledMinMax(
			100_000,
			() => sampler(makeTestCtx(rng)),
			(v) => v,
		);
		expect(min).toBeGreaterThanOrEqual(center - deviation);
		expect(max).toBeLessThanOrEqual(center + deviation);
	});

	test("output is approx. uniform", () => {
		const rng = createRng(7);
		const sampler = spread(0, 50);
		const { mean } = sampledMeanStdDev(
			100_000,
			() => sampler(makeTestCtx(rng)),
			(v) => v,
		);
		expect(mean).toBeCloseTo(0, 1);
	});

	test("respects batching, if provided", () => {
		const rng = createRng(14);
		const sampler = spread(50, 30);
		const { min, max } = sampledMinMax(
			100_000,
			() =>
				sampler(
					makeTestCtx(rng, {
						index: 0,
						batch: { index: 2, size: 3 },
					}),
				),
			(v) => v,
		);
		expect(min).toBeGreaterThanOrEqual(60);
		expect(max).toBeLessThanOrEqual(80);
	});
});
