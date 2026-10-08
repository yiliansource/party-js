import { describe, expect, test } from "bun:test";

import { length } from "@/math/vec3";
import { createRng } from "@/random/rng";
import { range } from "@/samplers";
import { cone } from "@/samplers/cone";
import { evaluateSampler } from "@/samplers/helpers";

import { sampledMaxAbsDeviation, sampledMinMax } from "../helpers";
import { vec3CloseTo } from "../math/helper";
import { makeTestCtx } from "./helpers";

describe("cone", () => {
	test("zero deviation returns exact result", () => {
		const sampler = cone(90, 0, 10);
		const rng = createRng(2);
		vec3CloseTo(evaluateSampler(sampler, makeTestCtx(rng)), {
			x: 0,
			y: 10,
			z: 0,
		});
	});

	test("sampled vector length equals speed", () => {
		const sampler = cone(0, 180, 20);
		const rng = createRng(7);
		const maxDev = sampledMaxAbsDeviation(
			100_000,
			() => evaluateSampler(sampler, makeTestCtx(rng)),
			(v) => length(v),
			20,
		);
		expect(maxDev).toBeLessThan(10e-6);
	});

	test("sampled angle is within [angle-deviation,angle+deviation]", () => {
		const sampler = cone(90, 45, 10);
		const rng = createRng(4);
		const { min, max } = sampledMinMax(
			100_000,
			() => evaluateSampler(sampler, makeTestCtx(rng)),
			(v) => (Math.atan2(v.y, v.x) * 180) / Math.PI,
		);
		expect(min).toBeGreaterThanOrEqual(45);
		expect(max).toBeLessThanOrEqual(135);
	});

	test("sampled result has no z-coordinate", () => {
		const sampler = cone(45, 45, 5);
		const rng = createRng(5);
		const maxDev = sampledMaxAbsDeviation(
			100_000,
			() => evaluateSampler(sampler, makeTestCtx(rng)),
			(v) => v.z,
			0,
		);
		expect(maxDev).toBeLessThan(10e-6);
	});

	test("sampled magnitude varies when speed is a sampler", () => {
		const sampler = cone(90, 45, range(10, 20));
		const rng = createRng(1);
		const maxDev = sampledMaxAbsDeviation(
			100_000,
			() => evaluateSampler(sampler, makeTestCtx(rng)),
			(v) => length(v),
			15,
		);
		expect(maxDev).toBeGreaterThan(3);
	});

	test("sampled magnitude stays within [min,max] when speed is a range sampler", () => {
		const sampler = cone(90, 45, range(10, 20));
		const rng = createRng(9);
		const { min, max } = sampledMinMax(
			100_000,
			() => evaluateSampler(sampler, makeTestCtx(rng)),
			(v) => length(v),
		);
		expect(min).toBeGreaterThanOrEqual(10);
		expect(max).toBeLessThanOrEqual(20);
	});
});
