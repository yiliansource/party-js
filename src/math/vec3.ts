import { lerp as lerpScalar } from "./scalar";

export interface Vec3 {
	x: number;
	y: number;
	z: number;
}

export const zero: Readonly<Vec3> = Object.freeze({ x: 0, y: 0, z: 0 });
export const unitX: Readonly<Vec3> = Object.freeze({ x: 1, y: 0, z: 0 });
export const unitY: Readonly<Vec3> = Object.freeze({ x: 0, y: 1, z: 0 });
export const unitZ: Readonly<Vec3> = Object.freeze({ x: 0, y: 0, z: 1 });

export function add(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z,
	};
}

export function sub(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z,
	};
}

export function scale(a: Readonly<Vec3>, b: number | Readonly<Vec3>): Vec3 {
	if (typeof b === "number") {
		return {
			x: a.x * b,
			y: a.y * b,
			z: a.z * b,
		};
	} else {
		return {
			x: a.x * b.x,
			y: a.y * b.y,
			z: a.z * b.z,
		};
	}
}

export function negate(v: Readonly<Vec3>): Vec3 {
	return {
		x: -v.x,
		y: -v.y,
		z: -v.z,
	};
}

export function dot(a: Readonly<Vec3>, b: Readonly<Vec3>): number {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function lengthSq(v: Readonly<Vec3>): number {
	return v.x ** 2 + v.y ** 2 + v.z ** 2;
}

export function length(v: Readonly<Vec3>): number {
	return Math.sqrt(lengthSq(v));
}

export function cross(a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 {
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x,
	};
}

export function normalize(v: Readonly<Vec3>): Vec3 {
	const l = length(v);
	if (l < Number.EPSILON) return { x: 0, y: 0, z: 0 };
	return scale(v, 1 / l);
}

export function lerp(a: Readonly<Vec3>, b: Readonly<Vec3>, t: number): Vec3 {
	return {
		x: lerpScalar(a.x, b.x, t),
		y: lerpScalar(a.y, b.y, t),
		z: lerpScalar(a.z, b.z, t),
	};
}
