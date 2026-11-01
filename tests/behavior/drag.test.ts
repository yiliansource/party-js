import { describe, expect, test } from "bun:test";

import {
	applyBehavior,
	type Behavior,
	initBehavior,
} from "@/behavior/behavior";
import { drag } from "@/behavior/drag";
import { gravity } from "@/behavior/gravity";
import * as quat from "@/math/quat";
import * as vec3 from "@/math/vec3";
import type { Particle } from "@/particle";
import { range } from "@/samplers";

import { makeTestParticle } from "../helpers";
import { vec3CloseTo } from "../math/helper";

describe("drag", () => {
	const dummyRng = () => 0;

	function spawn(behavior: Behavior, overrides: Partial<Particle> = {}) {
		const p = makeTestParticle(overrides);
		initBehavior(behavior, p, { rng: dummyRng });
		return p;
	}

	function step(p: Particle, behaviors: Behavior[], dt: number, steps = 1) {
		const ctx = { dt, rng: dummyRng };
		for (let i = 0; i < steps; i++) {
			for (const b of behaviors) applyBehavior(b, p, ctx);
		}
	}

	test("leaves a stationary particle stationary", () => {
		const d = drag(5);
		const p = spawn(d);
		step(p, [d], 1 / 60);
		expect(p.velocity).toEqual(vec3.zero);
	});

	test("loses the fraction `rate` of its velocity per second, exponentially", () => {
		const d = drag(5);
		const p = spawn(d, { velocity: { x: 300, y: -400, z: 0 } });
		step(p, [d], 1 / 60, 60);
		vec3CloseTo(
			p.velocity,
			vec3.scale({ x: 300, y: -400, z: 0 }, Math.exp(-5)),
		);
	});

	test("doesn't depend on the step size", () => {
		const d = drag(5);
		const coarse = spawn(d, { velocity: { x: 0, y: 1000, z: 0 } });
		const fine = spawn(d, { velocity: { x: 0, y: 1000, z: 0 } });
		step(coarse, [d], 0.5);
		step(fine, [d], 1 / 120, 60);
		vec3CloseTo(coarse.velocity, fine.velocity, 6);
	});

	test("never reverses direction, even with a huge rate and step", () => {
		const d = drag(1000);
		const p = spawn(d, { velocity: { x: 0, y: -1000, z: 0 } });
		step(p, [d], 1);
		expect(p.velocity.y).toBeLessThanOrEqual(0);
		expect(p.velocity.y).toBeGreaterThan(-1e-6);
	});

	test("settles at a terminal velocity of gravity / rate together with gravity", () => {
		const strength = 800;
		const terminalVelocity = 160;
		const g = gravity(strength);
		const d = drag(strength / terminalVelocity);
		const p = spawn(d);
		const dt = 1 / 120;
		step(p, [g, d], dt, 120 * 10);

		// the exact discrete steady state of v = (v + g*dt) * e^(-rate*dt)
		const decay = Math.exp((-strength / terminalVelocity) * dt);
		const expected = (strength * dt * decay) / (1 - decay);
		expect(Math.abs(p.velocity.y)).toBeCloseTo(expected, 6);
		expect(Math.abs(p.velocity.y)).toBeCloseTo(terminalVelocity, -1);
	});

	test("samples the rate once for each particle", () => {
		const d = drag(range(2, 6));
		const slow = makeTestParticle({ velocity: { x: 0, y: 100, z: 0 } });
		const fast = makeTestParticle({ velocity: { x: 0, y: 100, z: 0 } });
		initBehavior(d, slow, { rng: () => 0 });
		initBehavior(d, fast, { rng: () => 0.999999 });

		// a different rng during updates must not change the sampled rate
		applyBehavior(d, slow, { dt: 1, rng: () => 0.5 });
		applyBehavior(d, fast, { dt: 1, rng: () => 0.5 });

		expect(slow.velocity.y).toBeCloseTo(100 * Math.exp(-2), 6);
		expect(fast.velocity.y).toBeCloseTo(100 * Math.exp(-6), 4);
	});

	describe("edgeRatio", () => {
		// with no rotation, the shape faces the viewer, so its normal is +z
		test("slows face-on movement more than edge-on movement", () => {
			const d = drag(5, 0.25);
			const faceOn = spawn(d, { velocity: { x: 0, y: 0, z: 100 } });
			const edgeOn = spawn(d, { velocity: { x: 100, y: 0, z: 0 } });
			step(faceOn, [d], 1 / 60, 60);
			step(edgeOn, [d], 1 / 60, 60);

			// scaled so that the average over all directions stays at 5
			const faceRate = (5 * 3) / (1 + 2 * 0.25);
			expect(faceOn.velocity.z).toBeCloseTo(100 * Math.exp(-faceRate), 6);
			expect(edgeOn.velocity.x).toBeCloseTo(
				100 * Math.exp(-faceRate * 0.25),
				6,
			);
		});

		test("makes a tilted particle glide sideways while it falls", () => {
			// normal pointing up and to the right, at 45°
			const tilted = quat.multiply(
				quat.fromAxisAngle(vec3.unitZ, Math.PI / 4),
				quat.fromAxisAngle(vec3.unitY, Math.PI / 2),
			);
			const normal = quat.basis(tilted).z;
			expect(normal.x).toBeCloseTo(Math.SQRT1_2, 9);
			expect(normal.y).toBeCloseTo(Math.SQRT1_2, 9);

			const d = drag(5, 0.4);
			const p = spawn(d, {
				orientation: tilted,
				velocity: { x: 0, y: -100, z: 0 },
			});
			step(p, [d], 1 / 60);

			// the face-on part of the fall is damped more, which leaves a push away from the normal
			expect(p.velocity.x).toBeGreaterThan(0);
			expect(p.velocity.y).toBeLessThan(0);
		});

		test("is the same in every direction at 1, regardless of orientation", () => {
			const d = drag(5, 1);
			const p = spawn(d, {
				orientation: quat.fromAxisAngle(vec3.unitX, 1),
				velocity: { x: 30, y: -40, z: 0 },
			});
			step(p, [d], 1 / 60);
			vec3CloseTo(
				p.velocity,
				vec3.scale({ x: 30, y: -40, z: 0 }, Math.exp(-5 / 60)),
			);
		});
	});
});
