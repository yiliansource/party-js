import * as quat from "@/math/quat";
import * as vec3 from "@/math/vec3";
import type { Particle } from "@/particle/particle";

export type BasicSampler<T> = () => T;

export function sampledMinMax<T>(
	n: number,
	sample: BasicSampler<T>,
	measure: (v: T) => number,
): { min: number; max: number } {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (let i = 0; i < n; i++) {
		const v = sample();
		const m = measure(v);
		min = Math.min(min, m);
		max = Math.max(max, m);
	}
	return { min, max };
}

export function sampledMaxAbsDeviation<T>(
	n: number,
	sample: BasicSampler<T>,
	measure: (v: T) => number,
	expected: number,
): number {
	let maxDev = 0;
	for (let i = 0; i < n; i++) {
		const v = sample();
		const m = measure(v);
		maxDev = Math.max(maxDev, Math.abs(m - expected));
	}
	return maxDev;
}

export function sampledMeanStdDev<T>(
	n: number,
	sample: BasicSampler<T>,
	measure: (v: T) => number,
): {
	mean: number;
	stdDev: number;
} {
	let sum = 0;
	let sumSq = 0;
	for (let i = 0; i < n; i++) {
		const v = sample();
		const m = measure(v);
		sum += m;
		sumSq += m ** 2;
	}
	const mean = sum / n;
	return {
		mean,
		stdDev: Math.sqrt(sumSq / n - mean ** 2),
	};
}

export function sampledEvery<T>(
	n: number,
	sample: () => T,
	predicate: (v: T) => boolean,
): { ok: true } | { ok: false; index: number; value: T } {
	for (let i = 0; i < n; i++) {
		const v = sample();
		if (!predicate(v)) return { ok: false, index: i, value: v };
	}
	return { ok: true };
}

export function sampledFrequencies<T>(
	n: number,
	sample: () => T,
): Map<T, number> {
	const freq = new Map<T, number>();
	for (let i = 0; i < n; i++) {
		const v = sample();
		const old = freq.get(v) ?? 0;
		freq.set(v, old + 1);
	}
	return freq;
}

export function makeTestParticle(overrides: Partial<Particle> = {}): Particle {
	return {
		position: vec3.zero,
		velocity: vec3.zero,
		orientation: quat.identity,
		angularVelocity: vec3.zero,
		size: 1,
		color: { l: 1, a: 0, b: 0, alpha: 1 },
		shape: {},
		age: 0,
		lifetime: 1,
		data: new Map(),
		...overrides,
	};
}
