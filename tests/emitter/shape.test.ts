import { describe, expect, test } from "bun:test";

import { emitFrom } from "@/emitter/shape";
import { createRng } from "@/random/rng";
import type { SamplerContext } from "@/samplers/types";

import { sampledEvery, sampledMinMax } from "../helpers";

function makeCtxWithRng(): SamplerContext {
	return { rng: createRng(1), index: 0 };
}

describe("emitFrom disk", () => {
	test("every sampled point stays within the disk's radius of its center", () => {
		const sampler = emitFrom({
			type: "disk",
			center: { x: 5, y: -3, z: 0 },
			radius: 10,
		});
		const ctx = makeCtxWithRng();

		const result = sampledEvery(
			10_000,
			() => sampler(ctx),
			(p) => {
				const dx = p.x - 5;
				const dy = p.y - -3;
				return Math.sqrt(dx * dx + dy * dy) < 10 + 1e-9;
			},
		);

		expect(result.ok).toBe(true);
	});

	test("leaves z at the shape's center (a flat disk in the XY plane)", () => {
		const sampler = emitFrom({
			type: "disk",
			center: { x: 0, y: 0, z: 7 },
			radius: 10,
		});
		const ctx = makeCtxWithRng();

		const { min, max } = sampledMinMax(
			1000,
			() => sampler(ctx),
			(p) => p.z,
		);

		expect(min).toBe(7);
		expect(max).toBe(7);
	});

	test("is uniform by area, not by radius - about 25% of points fall within half the radius", () => {
		const sampler = emitFrom({
			type: "disk",
			center: { x: 0, y: 0, z: 0 },
			radius: 10,
		});
		const ctx = makeCtxWithRng();

		let insideHalfRadius = 0;
		const n = 50_000;
		for (let i = 0; i < n; i++) {
			const p = sampler(ctx);
			const dist = Math.sqrt(p.x * p.x + p.y * p.y);
			if (dist < 5) insideHalfRadius++;
		}

		expect(insideHalfRadius / n).toBeGreaterThan(0.23);
		expect(insideHalfRadius / n).toBeLessThan(0.27);
	});
});

describe("emitFrom rect", () => {
	test("every sampled point stays within the rect's bounds", () => {
		const sampler = emitFrom({
			type: "rect",
			center: { x: 2, y: 4, z: 0 },
			width: 6,
			height: 2,
		});
		const ctx = makeCtxWithRng();

		const result = sampledEvery(
			10_000,
			() => sampler(ctx),
			(p) => {
				return (
					p.x >= 2 - 3 - 1e-9 &&
					p.x <= 2 + 3 + 1e-9 &&
					p.y >= 4 - 1 - 1e-9 &&
					p.y <= 4 + 1 + 1e-9
				);
			},
		);

		expect(result.ok).toBe(true);
	});

	test("leaves z at the shape's center (a flat rect in the XY plane)", () => {
		const sampler = emitFrom({
			type: "rect",
			center: { x: 0, y: 0, z: -2 },
			width: 4,
			height: 4,
		});
		const ctx = makeCtxWithRng();

		const { min, max } = sampledMinMax(
			1000,
			() => sampler(ctx),
			(p) => p.z,
		);

		expect(min).toBe(-2);
		expect(max).toBe(-2);
	});

	test("covers the full width and height, not just a narrow band", () => {
		const sampler = emitFrom({
			type: "rect",
			center: { x: 0, y: 0, z: 0 },
			width: 10,
			height: 10,
		});
		const ctx = makeCtxWithRng();

		const { min: minX, max: maxX } = sampledMinMax(
			10_000,
			() => sampler(ctx),
			(p) => p.x,
		);

		expect(minX).toBeLessThan(-4.5);
		expect(maxX).toBeGreaterThan(4.5);
	});
});
