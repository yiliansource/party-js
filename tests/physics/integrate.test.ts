import { describe, expect, test } from "bun:test";

import * as quat from "@/math/quat";
import { integrate } from "@/physics/integrate";

import { makeTestParticle } from "../helpers";

describe("integrate", () => {
	test("integrates position linearly by velocity * dt", () => {
		const p = makeTestParticle({
			position: { x: 1, y: 2, z: 3 },
			velocity: { x: 4, y: -5, z: 6 },
		});
		integrate(p, 0.5);
		expect(p.position).toEqual({ x: 3, y: -0.5, z: 6 });
	});

	test("delegates orientation integration to quat.integrate", () => {
		const orientation = quat.fromAxisAngle(
			{ x: 0, y: 1, z: 0 },
			Math.PI / 4,
		);
		const angularVelocity = { x: 40, y: -20, z: 10 };
		const dt = 1 / 60;

		const expected = quat.integrate(orientation, angularVelocity, dt);

		const p = makeTestParticle({ orientation, angularVelocity });
		integrate(p, dt);

		expect(p.orientation.x).toBeCloseTo(expected.x, 12);
		expect(p.orientation.y).toBeCloseTo(expected.y, 12);
		expect(p.orientation.z).toBeCloseTo(expected.z, 12);
		expect(p.orientation.w).toBeCloseTo(expected.w, 12);
	});

	test("dt=0 is a no-op for both position and orientation", () => {
		const position = { x: 5, y: 5, z: 5 };
		const orientation = quat.fromAxisAngle({ x: 1, y: 0, z: 0 }, 1);
		const p = makeTestParticle({
			position,
			velocity: { x: 10, y: 10, z: 10 },
			orientation,
			angularVelocity: { x: 90, y: 0, z: 0 },
		});
		integrate(p, 0);
		expect(p.position).toEqual(position);
		expect(p.orientation.x).toBeCloseTo(orientation.x, 12);
		expect(p.orientation.y).toBeCloseTo(orientation.y, 12);
		expect(p.orientation.z).toBeCloseTo(orientation.z, 12);
		expect(p.orientation.w).toBeCloseTo(orientation.w, 12);
	});

	test("zero velocity leaves orientation-only particle's position untouched", () => {
		const p = makeTestParticle({
			position: { x: 1, y: 2, z: 3 },
			velocity: { x: 0, y: 0, z: 0 },
			angularVelocity: { x: 90, y: 0, z: 0 },
		});
		integrate(p, 1 / 60);
		expect(p.position).toEqual({ x: 1, y: 2, z: 3 });
	});

	test("zero angular velocity leaves position-only particle's orientation untouched", () => {
		const p = makeTestParticle({
			velocity: { x: 1, y: 2, z: 3 },
			orientation: quat.identity,
			angularVelocity: { x: 0, y: 0, z: 0 },
		});
		integrate(p, 1 / 60);
		expect(p.orientation).toEqual(quat.identity);
	});

	test("does not mutate velocity", () => {
		const velocity = { x: 1, y: -2, z: 3 };
		const p = makeTestParticle({ velocity });
		integrate(p, 1 / 60);
		expect(p.velocity).toEqual({ x: 1, y: -2, z: 3 });
	});

	test("position integration scales linearly with dt (two half-steps == one full step)", () => {
		const start = { x: 0, y: 0, z: 0 };
		const velocity = { x: 7, y: -3, z: 2 };
		const dt = 1 / 30;

		const full = makeTestParticle({ position: start, velocity });
		integrate(full, dt);

		const half = makeTestParticle({ position: start, velocity });
		integrate(half, dt / 2);
		integrate(half, dt / 2);

		expect(half.position.x).toBeCloseTo(full.position.x, 12);
		expect(half.position.y).toBeCloseTo(full.position.y, 12);
		expect(half.position.z).toBeCloseTo(full.position.z, 12);
	});
});
