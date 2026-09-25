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
