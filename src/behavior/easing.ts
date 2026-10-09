/**
 * A function that reshapes progress from 0 to 1, used by behaviors like {@link fade} and {@link gravity}
 * to make a transition start or end softly.
 *
 * It receives a progress `t` from 0 to 1 and returns the eased value. It is expect to return 0 at `t = 0`
 * and 1 at `t = 1`. In between, its shape determines how fast the transition moves.
 *
 * @param t - The received progress from 0 to 1.
 * @returns The reshaped progress.
 *
 * @summary Reshapes progress to make transitions start or end softly.
 *
 * @example
 * ```ts
 * // A custom ease that starts even more slowly than sineIn.
 * const cubicIn: Easing = (t) => t ** 3;
 * fade(0.2, 0.5, cubicIn);
 * ```
 *
 * @group Behaviors
 */
export type Easing = (t: number) => number;

/**
 * Creates an easing that moves at a constant rate.
 *
 * @summary Moves at a constant rate.
 *
 * @group Behaviors
 */
export function linear(): Easing {
	return (t) => t;
}

/**
 * Creates an easing that starts slowly and speeds up towards the end.
 *
 * @summary Starts slowly and speeds up.
 *
 * @see https://easings.net/#easeInSine
 *
 * @group Behaviors
 */
export function sineIn(): Easing {
	return (t) => 1 - Math.cos((t * Math.PI) / 2);
}

/**
 * Creates an easing that starts quickly and slows down towards the end.
 *
 * @summary Starts quickly and slows down.
 *
 * @see https://easings.net/#easeOutSine
 *
 * @group Behaviors
 */
export function sineOut(): Easing {
	return (t) => Math.sin((t * Math.PI) / 2);
}

/**
 * Creates an easing that starts slowly, speeds up towards the middle and slows down at the end.
 *
 * @summary Starts slowly, speeds up and slows down again.
 *
 * @see https://easings.net/#easeInOutSine
 *
 * @group Behaviors
 */
export function sineInOut(): Easing {
	return (t) => -(Math.cos(Math.PI * t) - 1) / 2;
}
