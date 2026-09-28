import { describe, expect, test } from "bun:test";

import { applyBehavior } from "@/behavior/behavior";
import { gravity } from "@/behavior/gravity";
import * as vec3 from "@/math/vec3";

import { makeTestParticle } from "../helpers";

describe("gravity", () => {
	const dummyRng = () => 0;

	test("adds downward velocity proportional to dt", () => {
		const p = makeTestParticle({ velocity: vec3.zero });
		applyBehavior(gravity(100), p, { dt: 1 / 60, rng: dummyRng });
		expect(p.velocity.y).toBeCloseTo(-100 / 60, 9);
	});

	test("accumulates linearly over multiple steps", () => {
		const p = makeTestParticle({ velocity: vec3.zero });
		const g = gravity(100);
		applyBehavior(g, p, { dt: 1 / 60, rng: dummyRng });
		applyBehavior(g, p, { dt: 1 / 60, rng: dummyRng });
		expect(p.velocity.y).toBeCloseTo(-2 * (100 / 60), 9);
	});

	test("only touches velocity.y, leaves x/z and position/orientation alone", () => {
		const p = makeTestParticle({ velocity: { x: 1, y: 0, z: -2 } });
		const before = { position: p.position, orientation: p.orientation };
		applyBehavior(gravity(100), p, { dt: 1 / 60, rng: dummyRng });
		expect(p.velocity.x).toBe(1);
		expect(p.velocity.z).toBe(-2);
		expect(p.position).toEqual(before.position);
		expect(p.orientation).toEqual(before.orientation);
	});

	test("strength scales linearly", () => {
		const p1 = makeTestParticle({ velocity: vec3.zero });
		const p2 = makeTestParticle({ velocity: vec3.zero });
		applyBehavior(gravity(100), p1, { dt: 1 / 60, rng: dummyRng });
		applyBehavior(gravity(100 * 2), p2, { dt: 1 / 60, rng: dummyRng });
		expect(p2.velocity.y).toBeCloseTo(p1.velocity.y * 2, 9);
	});
});
