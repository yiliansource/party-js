import { pick, type Sampler } from "../samplers";

export function withDefaults<D extends object, O extends object>(
	defaults: D,
	options?: O,
): D & Omit<O, keyof D> {
	const result = { ...defaults } as Record<string, unknown>;
	for (const key in options) {
		const value = options[key];
		if (value !== undefined) result[key] = value;
	}
	return result as D & Omit<O, keyof D>;
}

export function pickOrSampler<T>(value: T[] | Sampler<T>): Sampler<T>;
export function pickOrSampler<T, U>(
	value: T[] | Sampler<U>,
	map: (item: T) => U,
): Sampler<U>;
export function pickOrSampler<T, U>(
	value: T[] | Sampler<U>,
	map?: (item: T) => U,
): Sampler<U> {
	if (!Array.isArray(value)) return value;
	return pick(map ? value.map(map) : (value as unknown as U[]));
}
