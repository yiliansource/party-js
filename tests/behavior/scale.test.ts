import { describe, expect, test } from "bun:test";

import {
	applyBehavior,
	type Behavior,
	initBehavior,
} from "@/behavior/behavior";
import { linear, sineIn } from "@/behavior/easing";
import { scale } from "@/behavior/scale";
import type { Particle } from "@/particle";

import { makeTestParticle } from "../helpers";

describe("scale", () => {
	const dummyRng = () => 0;
	const ctx = { dt: 1 / 60, rng: dummyRng };

	function run(p: Particle, behavior: Behavior) {
		initBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
	}

	test("inDuration: 0, outDuration: 0 is a no-op at any age", () => {
		for (const age of [0, 0.3, 0.9, 1]) {
			const p = makeTestParticle({ size: 20, age, lifetime: 1 });
			run(p, scale(0, 0));
			expect(p.size).toBe(20);
		}
	});

	test("in-phase: starts at 0 and reaches full size by inDuration, then stays there", () => {
		const behavior = scale(0.5, 0);

		const start = makeTestParticle({ size: 20, age: 0, lifetime: 10 });
		run(start, behavior);
		expect(start.size).toBeCloseTo(0, 9);

		const mid = makeTestParticle({ size: 20, age: 0.25, lifetime: 10 });
		run(mid, scale(0.5, 0));
		expect(mid.size).toBeCloseTo(10, 9);

		const atDuration = makeTestParticle({
			size: 20,
			age: 0.5,
			lifetime: 10,
		});
		run(atDuration, scale(0.5, 0));
		expect(atDuration.size).toBeCloseTo(20, 9);

		const wellAfter = makeTestParticle({ size: 20, age: 9, lifetime: 10 });
		run(wellAfter, scale(0.5, 0));
		expect(wellAfter.size).toBeCloseTo(20, 9);
	});

	test("out-phase: stays full size until outDuration remains, then ramps to 0 at death", () => {
		const early = makeTestParticle({ size: 20, age: 0, lifetime: 1 });
		run(early, scale(0, 0.3));
		expect(early.size).toBeCloseTo(20, 9);

		// remaining = 1 - 0.9 = 0.1, outFactor = 0.1 / 0.3
		const late = makeTestParticle({ size: 20, age: 0.9, lifetime: 1 });
		run(late, scale(0, 0.3));
		expect(late.size).toBeCloseTo(20 * (0.1 / 0.3), 9);

		const atDeath = makeTestParticle({ size: 20, age: 1, lifetime: 1 });
		run(atDeath, scale(0, 0.3));
		expect(atDeath.size).toBeCloseTo(0, 9);
	});

	test("overlapping windows: takes the minimum of the in- and out-ramp, not the in-ramp alone", () => {
		// lifetime 0.5 is shorter than inDuration (0.5) + outDuration (0.3), so the
		// windows overlap. At age=0.4 (remaining=0.1): inFactor=0.8, outFactor=1/3.
		// the correct behavior takes the min (1/3), not just the in-ramp (0.8).
		const p = makeTestParticle({ size: 20, age: 0.4, lifetime: 0.5 });
		run(p, scale(0.5, 0.3));
		expect(p.size).toBeCloseTo(20 * (1 / 3), 9);
	});

	test("respects a non-linear ease function", () => {
		const t = 0.25;
		const p = makeTestParticle({ size: 20, age: t * 0.5, lifetime: 10 });
		run(p, scale(0.5, 0, sineIn()));
		expect(p.size).toBeCloseTo(20 * sineIn()(t), 9);
	});

	test("snapshots each particle's own base size independently", () => {
		const behavior = scale(0.5, 0);
		const small = makeTestParticle({ size: 10, age: 0.25, lifetime: 10 });
		const large = makeTestParticle({ size: 100, age: 0.25, lifetime: 10 });
		run(small, behavior);
		run(large, behavior);
		expect(small.size).toBeCloseTo(5, 9);
		expect(large.size).toBeCloseTo(50, 9);
	});

	test("repeated update() calls at the same age don't compound", () => {
		const behavior = scale(0.5, 0);
		const p = makeTestParticle({ size: 20, age: 0.25, lifetime: 10 });
		initBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
		const first = p.size;
		applyBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
		expect(p.size).toBeCloseTo(first, 9);
	});

	test("default ease is linear", () => {
		const withDefault = makeTestParticle({
			size: 20,
			age: 0.1,
			lifetime: 10,
		});
		const withExplicitLinear = makeTestParticle({
			size: 20,
			age: 0.1,
			lifetime: 10,
		});

		run(withDefault, scale(0.5, 0));
		run(withExplicitLinear, scale(0.5, 0, linear()));
		expect(withDefault.size).toBeCloseTo(withExplicitLinear.size, 9);
	});
});
