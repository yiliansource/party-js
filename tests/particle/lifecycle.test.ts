import { describe, expect, test } from "bun:test";

import { advanceLifecycle, isDead, progress } from "@/particle/lifecycle";

import { makeTestParticle } from "../helpers";

describe("lifecycle", () => {
	describe("advanceLifecycle", () => {
		test("advances the particles age by the specified amount", () => {
			const p = makeTestParticle({ age: 0, lifetime: 1 });
			advanceLifecycle(p, 0.25);
			expect(p.age).toBeCloseTo(0.25, 9);
			advanceLifecycle(p, 0.25);
			expect(p.age).toBeCloseTo(0.5, 9);
		});
	});

	describe("progress", () => {
		test("accurately reports the particle age progress", () => {
			const p = makeTestParticle({ age: 0.5, lifetime: 2 });
			expect(progress(p)).toBeCloseTo(0.25, 9);
			advanceLifecycle(p, 0.5);
			expect(progress(p)).toBeCloseTo(0.5, 9);
		});

		test("clamps the progress to [0,1]", () => {
			const p = makeTestParticle({ age: -1, lifetime: 2 });
			expect(progress(p)).toBeCloseTo(0, 9);
			advanceLifecycle(p, 5);
			expect(progress(p)).toBeCloseTo(1, 9);
		});
	});

	describe("isDead", () => {
		test("accurately reports if a particle is dead", () => {
			const p = makeTestParticle({ age: 0, lifetime: 1 });
			expect(isDead(p)).toBe(false);
			advanceLifecycle(p, 0.5);
			expect(isDead(p)).toBe(false);
			advanceLifecycle(p, 0.5);
			expect(isDead(p)).toBe(true);
			advanceLifecycle(p, 0.5);
			expect(isDead(p)).toBe(true);
		});
	});
});
