/**
 * @group Custom effects
 */
export type Live<T> = T | (() => T);

export function resolveLive<T>(value: Live<T>): T {
	return typeof value === "function" ? (value as () => T)() : value;
}
