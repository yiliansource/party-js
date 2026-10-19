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
