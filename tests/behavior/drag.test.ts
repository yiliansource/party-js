import { describe, expect, test } from "bun:test";

import { applyBehavior } from "@/behavior";
import { drag } from "@/behavior/drag";
import { gravity } from "@/behavior/gravity";
import * as vec3 from "@/math/vec3";

import { makeTestParticle } from "../helpers";
import { vec3CloseTo } from "../math/helper";

describe("drag", () => {
	const dummyRng = () => 0;

	test("leaves a stationary particle stationary", () => {
		const p = makeTestParticle({ velocity: vec3.zero });
		applyBehavior(drag(100 / 5 ** 2), p, { dt: 1 / 60, rng: dummyRng });
		expect(p.velocity).toEqual(vec3.zero);
	});

	test("never increases speed in a single step", () => {
		const p = makeTestParticle({ velocity: { x: 0, y: -3, z: 4 } }); // speed 5
		applyBehavior(drag(100 / 5 ** 2), p, { dt: 1 / 60, rng: dummyRng });
		expect(vec3.length(p.velocity)).toBeLessThanOrEqual(5);
	});

	test("clamps rather than reversing direction under an extreme speed/dt combo", () => {
		const p = makeTestParticle({ velocity: { x: 0, y: -1000, z: 0 } });
		applyBehavior(drag(100 / 5 ** 2), p, { dt: 1, rng: dummyRng }); // large dt
		vec3CloseTo(p.velocity, vec3.zero);
	});

	test("gravity + drag settle at the exact discrete steady state", () => {
		const p = makeTestParticle({ velocity: vec3.zero });
		const strength = 100;
		const terminalVelocity = 5;
		const g = gravity(strength);
		const d = drag(strength / terminalVelocity ** 2);
		const ctx = { dt: 1 / 60, rng: dummyRng };
		for (let i = 0; i < 60 * 10; i++) {
			applyBehavior(g, p, ctx);
			applyBehavior(d, p, ctx);
		}
		// closed form for the discrete steady state of gravity+drag under
		// semi-implicit Euler at a fixed dt: |v| settles at
		// terminalVelocity - strength*dt, not exactly at terminalVelocity
		const expected = terminalVelocity - strength * ctx.dt;
		expect(Math.abs(p.velocity.y)).toBeCloseTo(expected, 6);
	});

	test("never overshoots terminal velocity", () => {
		const p = makeTestParticle({ velocity: vec3.zero });
		const g = gravity(100);
		const d = drag(100 / 5 ** 2);
		const ctx = { dt: 1 / 60, rng: dummyRng };
		let maxAbs = 0;
		for (let i = 0; i < 60 * 10; i++) {
			applyBehavior(g, p, ctx);
			applyBehavior(d, p, ctx);
			maxAbs = Math.max(maxAbs, Math.abs(p.velocity.y));
		}
		expect(maxAbs).toBeLessThanOrEqual(5 + 1e-6);
	});
});
