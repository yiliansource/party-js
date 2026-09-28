/**
 * A small memoization cache for shape Path2Ds, keyed by a string built from the
 * shape's parameters. Each built-in shape module owns its own private cache instance.
 */
export function createShapeCache() {
	const cache = new Map<string, Path2D>();

	return function resolve(key: string, build: () => Path2D): Path2D {
		const cached = cache.get(key);
		if (cached) return cached;

		const path = build();
		cache.set(key, path);
		return path;
	};
}
