import { describe, expect, test } from "bun:test";

import { createRng } from "../../src/random/rng";
import { spread } from "../../src/samplers/spread";
import { sampledMeanStdDev, sampledMinMax } from "../helpers";
import { createTestCtx } from "./helpers";

describe("spread", () => {
	test("output is in [center-deviation, center+deviation]", () => {
		const [center, deviation] = [30, 20];
		const rng = createRng(3);
		const sampler = spread(center, deviation);
		const { min, max } = sampledMinMax(
			100_000,
			() => sampler(createTestCtx(rng)),
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
			() => sampler(createTestCtx(rng)),
			(v) => v,
		);
		expect(mean).toBeCloseTo(0, 1);
	});

	test("respects index and count, if provided", () => {
		const rng = createRng(14);
		const sampler = spread(50, 30);
		const { min, max } = sampledMinMax(
			100_000,
			() => sampler(createTestCtx(rng, { index: 2, count: 3 })),
			(v) => v,
		);
		expect(min).toBeGreaterThanOrEqual(60);
		expect(max).toBeLessThanOrEqual(80);
	});
});
