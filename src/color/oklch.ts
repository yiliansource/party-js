import * as scalar from "../math/scalar";
import type { Color } from "./color";

export interface Oklch {
	l: number;
	c: number;
	h: number;
}

export function toPolar(c: Color): Oklch {
	return {
		l: c.l,
		c: Math.hypot(c.a, c.b),
		h: (Math.atan2(c.b, c.a) * scalar.rad2deg + 360) % 360,
	};
}

export function fromPolar(p: Oklch, alpha: number): Color {
	const rad = p.h * scalar.deg2rad;
	return {
		l: p.l,
		a: p.c * Math.cos(rad),
		b: p.c * Math.sin(rad),
		alpha,
	};
}

export function lerpHue(a: number, b: number, t: number): number {
	const diff = ((b - a + 540) % 360) - 180;
	return (a + diff * t + 360) % 360;
}
