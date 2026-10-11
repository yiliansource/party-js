/**
 * A value that can change while an effect runs: either a fixed value, or a function that party.js
 * calls again each time it needs the value.
 *
 * Use a function to follow something outside of the effect, for example the window size, the scroll position
 * or an element that moves its position. Unlike a {@link Sampler}, the function receives no context. It is not
 * about variety between particles, but rather about reacting to page state.
 *
 * @summary A value that can change while an effect runs.
 *
 * @example
 * ```ts
 * // Keep emitting from the center of the window, even when it's resized.
 * const origin = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
 * ```
 *
 * @group Custom effects
 */
export type Live<T> = T | (() => T);

export function resolveLive<T>(value: Live<T>): T {
	return typeof value === "function" ? (value as () => T)() : value;
}
