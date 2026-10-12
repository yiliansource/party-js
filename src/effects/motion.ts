/**
 * What an effect does when the user has asked their system for reduced motion, through the
 * `prefers-reduced-motion` media query:
 *
 * - `"skip"`: the effect doesn't play and draws nothing. Its `onComplete` callback, if it has one, is still
 *   called right after the effect is created, so code that waits for the effect to complete keeps working.
 * - `"play"`: the effect plays as usual.
 *
 * The user's preference is read once, when the effect starts. Changing it while an effect is running doesn't
 * affect that effect.
 *
 * Particle effects are usually decoration, so party.js skips them by default. Only use `"play"` when the particles
 * carry information the user would otherwise miss, or when the user has explicitly asked to see them, for example
 * through a setting on your site.
 *
 * @summary What an effect does when the user prefers reduced motion.
 *
 * @see [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
 *
 * @group Effects
 */
export type ReducedMotion = "skip" | "play";

let defaultReducedMotion: ReducedMotion = "skip";

/**
 * Sets what effects do by default when the user has asked their system for reduced motion. Effects can override
 * this behavior with their `reducedMotion` option. Useful when your site has its own motion setting that should
 * take precedence.
 *
 * @param mode - The default mode to apply to created effects.
 *
 * @summary Sets the default way of handling reduced motion.
 *
 * @group Effects
 */
export function setDefaultReducedMotion(mode: ReducedMotion): void {
	defaultReducedMotion = mode;
}

function prefersReducedMotion(): boolean {
	return (
		typeof matchMedia === "function" &&
		matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

export function shouldSkip(mode: ReducedMotion | undefined): boolean {
	return (mode ?? defaultReducedMotion) === "skip" && prefersReducedMotion();
}
