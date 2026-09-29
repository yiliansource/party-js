import { describe, expect, test } from "bun:test";

import type { Behavior } from "@/behavior/behavior";
import { Emitter } from "@/emitter/emitter";
import type { ParticleInit } from "@/emitter/spawn";
import * as quat from "@/math/quat";
import * as vec3 from "@/math/vec3";
import { createRng } from "@/random/rng";

const staticInit: ParticleInit = {
	position: vec3.zero,
	velocity: vec3.zero,
	orientation: quat.identity,
	angularVelocity: vec3.zero,
	size: 10,
	color: { l: 0.5, a: 0, b: 0, alpha: 1 },
	shape: { type: "circle" },
	lifetime: 1,
};

describe("Emitter", () => {
	test("spawns a burst of particles on the tick it fires", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 1,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 5 }],
			},
			particleInit: staticInit,
			rng: createRng(1),
		});

		emitter.tick(0.016);

		expect(emitter.particles.length).toBe(5);
	});

	test("applies behaviors to spawned particles each tick", () => {
		let applied = 0;
		const countingBehavior: Behavior = () => {
			applied++;
		};

		const emitter = new Emitter({
			schedule: {
				duration: 1,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 2 }],
			},
			particleInit: staticInit,
			rng: createRng(1),
			behaviors: [countingBehavior],
		});

		emitter.tick(0.016);
		emitter.tick(0.016);

		expect(applied).toBe(4);
	});

	test("drops particles once they exceed their lifetime", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 1,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 1 }],
			},
			particleInit: {
				...staticInit,
				lifetime: 0.5,
			},
			rng: createRng(1),
		});

		emitter.tick(0.016);
		expect(emitter.particles.length).toBe(1);

		emitter.tick(1);
		expect(emitter.particles.length).toBe(0);
	});

	test("isExpired reflects the schedule", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 0.5,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 2 }],
			},
			particleInit: {
				...staticInit,
				lifetime: 10,
			},
			rng: createRng(1),
		});

		emitter.tick(1);

		expect(emitter.isExpired).toBe(true);
		expect(emitter.particles.length).toBe(2);
		expect(emitter.isDone).toBe(false);
	});

	test("isDone once expired and empty", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 0.5,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 1 }],
			},
			particleInit: { ...staticInit, lifetime: 0.1 },
			rng: createRng(1),
		});

		emitter.tick(1);

		expect(emitter.isDone).toBe(true);
	});

	test("uses samplers to vary particle values, given the index in context", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 1,
				loops: 1,
				rate: 0,
				bursts: [{ time: 0, count: 3 }],
			},
			particleInit: {
				...staticInit,
				size: (ctx) => ctx.index * 10,
			},
			rng: createRng(1),
		});

		emitter.tick(0.016);

		expect(emitter.particles.map((p) => p.size).sort()).toEqual([
			0, 10, 20,
		]);
	});

	test("the spawn index keeps climbing across ticks", () => {
		const seenIndices: number[] = [];
		const emitter = new Emitter({
			schedule: {
				duration: 1,
				loops: Number.POSITIVE_INFINITY,
				rate: 0,
				bursts: [
					{ time: 0, count: 1 },
					{ time: 0.5, count: 1 },
				],
			},
			particleInit: {
				...staticInit,
				lifetime: 0.1,
				size: (ctx) => {
					seenIndices.push(ctx.index);
					return 1;
				},
			},
			rng: createRng(1),
		});

		emitter.tick(0.2);
		emitter.tick(0.4);

		expect(seenIndices).toEqual([0, 1]);
	});

	test("keeps spawning indefinitely with an infinite loop count", () => {
		const emitter = new Emitter({
			schedule: {
				duration: 0.1,
				loops: Number.POSITIVE_INFINITY,
				rate: 0,
				bursts: [{ time: 0, count: 1 }],
			},
			particleInit: { ...staticInit, lifetime: 0.05 },
			rng: createRng(1),
		});

		for (let i = 0; i < 50; i++) {
			emitter.tick(0.1);
		}

		expect(emitter.isExpired).toBe(false);
	});
});
