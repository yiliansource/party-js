import { describe, expect, test } from "bun:test";

import {
	applyBehavior,
	type Behavior,
	initBehavior,
} from "@/behavior/behavior";
import { fade } from "@/behavior/fade";
import { scale } from "@/behavior/scale";
import { twinkle } from "@/behavior/twinkle";
import type { Particle } from "@/particle";

import { makeTestParticle } from "../helpers";

const BASE_COLOR = { l: 0.7, a: 0.05, b: 0.12, alpha: 1 };

// an rng that returns these values in order, then repeats the last one
function sequence(...values: number[]) {
	let i = 0;
	return () => values[Math.min(i++, values.length - 1)];
}

function spawn(behaviors: Behavior[], rng: () => number, lifetime = 1) {
	const p = makeTestParticle({ size: 10, color: BASE_COLOR, lifetime });
	for (const b of behaviors) initBehavior(b, p, { rng });
	return p;
}

function runTo(p: Particle, behaviors: Behavior[], age: number, dt = 1 / 120) {
	while (p.age < age - 1e-9) {
		p.age = Math.min(p.age + dt, age);
		for (const b of behaviors) applyBehavior(b, p, { dt, rng: () => 0 });
	}
}

describe("twinkle", () => {
	// glints: 2 over a lifetime of 1 gives 2 glints (with a rounding draw of 0), at 0.5 and 0.95
	const at = () => sequence(0, 0.5, 0.95);

	test("grows and brightens a particle at the peak of a glint", () => {
		const t = twinkle({ glints: 2, size: 0.25, brightness: 0.6 });
		const p = spawn([t], at());

		runTo(p, [t], 0.5);

		expect(p.size).toBeCloseTo(12.5, 6);
		expect(p.color.l).toBeCloseTo(0.7 + 0.3 * 0.6, 6);
		expect(p.color.a).toBeCloseTo(0.05 * (1 - 0.7 * 0.6), 6);
		expect(p.color.alpha).toBe(1);
	});

	test("leaves a particle as it was between glints", () => {
		const t = twinkle({ glints: 2 });
		const p = spawn([t], at());

		runTo(p, [t], 0.2);

		expect(p.size).toBeCloseTo(10, 4);
		expect(p.color.l).toBeCloseTo(0.7, 4);
	});

	test("settles back after a glint, without the change building up", () => {
		const t = twinkle({ glints: 2, length: 0.2 });
		const p = spawn([t], at());

		runTo(p, [t], 0.5);
		runTo(p, [t], 0.72);

		expect(p.size).toBeCloseTo(10, 3);
		expect(p.color.l).toBeCloseTo(0.7, 3);
		expect(p.color.a).toBeCloseTo(0.05, 3);
	});

	test("glints on top of the size scale() sets, when listed after it", () => {
		const t = twinkle({ glints: 2, size: 0.25 });
		const behaviors = [scale(1, 0), t];
		const p = spawn(behaviors, at());

		runTo(p, behaviors, 0.5);

		// scale() has grown the particle to half its size at 0.5s, and the glint adds 25% on top
		expect(p.size).toBeCloseTo(5 * 1.25, 6);
	});

	test("works together with fade(), in either order", () => {
		for (const order of ["after", "before"] as const) {
			const t = twinkle({ glints: 2, brightness: 0.6 });
			const f = fade(0, 1);
			const behaviors = order === "after" ? [f, t] : [t, f];
			const p = spawn(behaviors, at());

			runTo(p, behaviors, 0.5);

			expect(p.color.alpha).toBeCloseTo(0.5, 6);
			expect(p.color.l).toBeCloseTo(0.7 + 0.3 * 0.6, 6);
		}
	});

	test("never glints with glints: 0", () => {
		const t = twinkle({ glints: 0 });
		const p = spawn([t], () => 0.99);

		for (const age of [0.1, 0.3, 0.6, 0.9]) {
			runTo(p, [t], age);
			expect(p.size).toBe(10);
		}
	});

	test("rejects options that are out of range", () => {
		expect(() => twinkle({ glints: -1 })).toThrow();
		expect(() => twinkle({ length: 0 })).toThrow();
		expect(() => twinkle({ size: Number.NaN })).toThrow();
		expect(() => twinkle({ brightness: 1.5 })).toThrow();
	});
});
