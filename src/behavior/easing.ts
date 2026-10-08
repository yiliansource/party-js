/**
 * @group Behaviors
 */
export type Easing = (t: number) => number;

/**
 * @group Behaviors
 */
export function linear(): Easing {
	return (t) => t;
}

/**
 * @group Behaviors
 */
export function sineIn(): Easing {
	return (t) => 1 - Math.cos((t * Math.PI) / 2);
}

/**
 * @group Behaviors
 */
export function sineOut(): Easing {
	return (t) => Math.sin((t * Math.PI) / 2);
}

/**
 * @group Behaviors
 */
export function sineInOut(): Easing {
	return (t) => -(Math.cos(Math.PI * t) - 1) / 2;
}
