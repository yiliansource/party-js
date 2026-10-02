export type Easing = (t: number) => number;

export function linear(): Easing {
	return (t) => t;
}
export function sineIn(): Easing {
	return (t) => 1 - Math.cos((t * Math.PI) / 2);
}
export function sineOut(): Easing {
	return (t) => Math.sin((t * Math.PI) / 2);
}
export function sineInOut(): Easing {
	return (t) => -(Math.cos(Math.PI * t) - 1) / 2;
}
