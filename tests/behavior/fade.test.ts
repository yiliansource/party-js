import { describe, expect, test } from "bun:test";

import { fade } from "@/behavior";
import {
	applyBehavior,
	type Behavior,
	initBehavior,
} from "@/behavior/behavior";
import { linear, sineIn } from "@/behavior/easing";
import type { Color } from "@/color";
import type { Particle } from "@/particle";

import { makeTestParticle } from "../helpers";

describe("fade", () => {
	const dummyRng = () => 0;
	const ctx = { dt: 1 / 60, rng: dummyRng };

	function makeTestColor(alpha: number = 1): Color {
		return { l: 0.5, a: 0, b: 0, alpha };
	}
	function run(p: Particle, behavior: Behavior) {
		initBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
	}

	test("inDuration: 0, outDuration: 0 is a no-op at any age", () => {
		for (const age of [0, 0.3, 0.9, 1]) {
			const p = makeTestParticle({
				color: makeTestColor(0.5),
				age,
				lifetime: 1,
			});
			run(p, fade(0, 0));
			expect(p.color.alpha).toBe(0.5);
		}
	});

	test("in-phase: starts at 0 and reaches full size by inDuration, then stays there", () => {
		const behavior = fade(0.5, 0);

		const start = makeTestParticle({
			color: makeTestColor(),
			age: 0,
			lifetime: 10,
		});
		run(start, behavior);
		expect(start.color.alpha).toBeCloseTo(0, 9);

		const mid = makeTestParticle({
			color: makeTestColor(),
			age: 0.25,
			lifetime: 10,
		});
		run(mid, fade(0.5, 0));
		expect(mid.color.alpha).toBeCloseTo(0.5, 9);

		const atDuration = makeTestParticle({
			color: makeTestColor(),
			age: 0.5,
			lifetime: 10,
		});
		run(atDuration, fade(0.5, 0));
		expect(atDuration.color.alpha).toBeCloseTo(1, 9);

		const wellAfter = makeTestParticle({
			color: makeTestColor(),
			age: 9,
			lifetime: 10,
		});
		run(wellAfter, fade(0.5, 0));
		expect(wellAfter.color.alpha).toBeCloseTo(1, 9);
	});

	test("out-phase: stays full size until outDuration remains, then ramps to 0 at death", () => {
		const early = makeTestParticle({
			color: makeTestColor(),
			age: 0,
			lifetime: 1,
		});
		run(early, fade(0, 0.3));
		expect(early.color.alpha).toBeCloseTo(1, 9);

		// remaining = 1 - 0.9 = 0.1, outFactor = 0.1 / 0.3
		const late = makeTestParticle({
			color: makeTestColor(),
			age: 0.9,
			lifetime: 1,
		});
		run(late, fade(0, 0.3));
		expect(late.color.alpha).toBeCloseTo(0.1 / 0.3, 9);

		const atDeath = makeTestParticle({
			color: makeTestColor(),
			age: 1,
			lifetime: 1,
		});
		run(atDeath, fade(0, 0.3));
		expect(atDeath.color.alpha).toBeCloseTo(0, 9);
	});

	test("overlapping windows: takes the minimum of the in- and out-ramp, not the in-ramp alone", () => {
		// lifetime 0.5 is shorter than inDuration (0.5) + outDuration (0.3), so the
		// windows overlap. At age=0.4 (remaining=0.1): inFactor=0.8, outFactor=1/3.
		// the correct behavior takes the min (1/3), not just the in-ramp (0.8).
		const p = makeTestParticle({
			color: makeTestColor(),
			age: 0.4,
			lifetime: 0.5,
		});
		run(p, fade(0.5, 0.3));
		expect(p.color.alpha).toBeCloseTo(1 / 3, 9);
	});

	test("respects a non-linear ease function", () => {
		const t = 0.25;
		const p = makeTestParticle({
			color: makeTestColor(),
			age: t * 0.5,
			lifetime: 10,
		});
		run(p, fade(0.5, 0, sineIn()));
		expect(p.color.alpha).toBeCloseTo(sineIn()(t), 9);
	});

	test("snapshots each particle's own base size independently", () => {
		const behavior = fade(0.5, 0);
		const small = makeTestParticle({
			color: makeTestColor(0.1),
			age: 0.25,
			lifetime: 10,
		});
		const large = makeTestParticle({
			color: makeTestColor(1),
			age: 0.25,
			lifetime: 10,
		});
		run(small, behavior);
		run(large, behavior);
		expect(small.color.alpha).toBeCloseTo(0.05, 9);
		expect(large.color.alpha).toBeCloseTo(0.5, 9);
	});

	test("repeated update() calls at the same age don't compound", () => {
		const behavior = fade(0.5, 0);
		const p = makeTestParticle({
			color: makeTestColor(),
			age: 0.25,
			lifetime: 10,
		});
		initBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
		const first = p.size;
		applyBehavior(behavior, p, ctx);
		applyBehavior(behavior, p, ctx);
		expect(p.size).toBeCloseTo(first, 9);
	});

	test("default ease is linear", () => {
		const withDefault = makeTestParticle({
			color: makeTestColor(),
			age: 0.1,
			lifetime: 10,
		});
		const withExplicitLinear = makeTestParticle({
			color: makeTestColor(),
			age: 0.1,
			lifetime: 10,
		});

		run(withDefault, fade(0.5, 0));
		run(withExplicitLinear, fade(0.5, 0, linear()));
		expect(withDefault.size).toBeCloseTo(withExplicitLinear.size, 9);
	});
});
