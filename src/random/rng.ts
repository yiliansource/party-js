/**
 * A function that returns a pseudo-random number from 0 (inclusive) to 1 (exclusive),
 * like {@link Math.random | Math.random()}.
 *
 * Every effect has one, created from its `seed`, to ensure that seeded effects play out
 * the same way every time. Samplers and behaviors receive it as `ctx.rng`. It is recommended
 * that you use it instead of `Math.random()` in your own samplers and behaviors, so they
 * stay reproducible too.
 *
 * @summary A source of random numbers from 0 to 1.
 *
 * @returns A pseudo-random number from 0 (inclusive) to 1 (exclusive).
 *
 * @group Utilities
 */
export type Rng = () => number;

function randomSeed(): number {
	return (Math.random() * 0xffffffff) >>> 0;
}

/**
 * Creates a mulberry32 pseudo-random number generator.
 * If no seed is provided, a random one will be produced based on `Math.random()`.
 *
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
export function createRng(seed?: number): Rng {
	let a = seed === undefined ? randomSeed() : seed;

	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
