import { deg2rad } from "./scalar";
import type { Vec3 } from "./vec3";
import * as vec3 from "./vec3";

export interface Quat {
	x: number;
	y: number;
	z: number;
	w: number;
}

export const zero: Readonly<Quat> = Object.freeze({ x: 0, y: 0, z: 0, w: 0 });
export const identity: Readonly<Quat> = Object.freeze({
	x: 0,
	y: 0,
	z: 0,
	w: 1,
});

export function add(a: Readonly<Quat>, b: Readonly<Quat>): Quat {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z,
		w: a.w + b.w,
	};
}

export function conjugate(q: Readonly<Quat>): Quat {
	return {
		x: -q.x,
		y: -q.y,
		z: -q.z,
		w: q.w,
	};
}

export function scale(q: Readonly<Quat>, s: number): Quat {
	return {
		x: q.x * s,
		y: q.y * s,
		z: q.z * s,
		w: q.w * s,
	};
}

export function multiply(a: Readonly<Quat>, b: Readonly<Quat>): Quat {
	return {
		w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
		x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
		y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
		z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
	};
}

export function lengthSq(q: Readonly<Quat>): number {
	return q.x ** 2 + q.y ** 2 + q.z ** 2 + q.w ** 2;
}

export function length(q: Readonly<Quat>): number {
	return Math.sqrt(lengthSq(q));
}

export function normalize(q: Readonly<Quat>): Quat {
	const l = length(q);
	if (l < Number.EPSILON) return { x: 0, y: 0, z: 0, w: 1 };
	return scale(q, 1 / l);
}

export function rotateVec3(q: Readonly<Quat>, v: Readonly<Vec3>): Vec3 {
	const qv: Vec3 = { x: q.x, y: q.y, z: q.z };
	const t = vec3.scale(vec3.cross(qv, v), 2);
	const t2 = vec3.cross(qv, t);
	return {
		x: v.x + q.w * t.x + t2.x,
		y: v.y + q.w * t.y + t2.y,
		z: v.z + q.w * t.z + t2.z,
	};
}

export function fromAxisAngle(axis: Readonly<Vec3>, angle: number): Quat {
	const a = vec3.normalize(axis);
	const half = angle / 2;
	const s = Math.sin(half);
	return { x: a.x * s, y: a.y * s, z: a.z * s, w: Math.cos(half) };
}

export function basis(q: Readonly<Quat>): {
	x: Vec3;
	y: Vec3;
	z: Vec3;
} {
	const { x, y, z, w } = q;
	const xx = x * x,
		yy = y * y,
		zz = z * z;
	const xy = x * y,
		xz = x * z,
		yz = y * z;
	const wx = w * x,
		wy = w * y,
		wz = w * z;

	return {
		x: { x: 1 - 2 * (yy + zz), y: 2 * (xy + wz), z: 2 * (xz - wy) },
		y: { x: 2 * (xy - wz), y: 1 - 2 * (xx + zz), z: 2 * (yz + wx) },
		z: { x: 2 * (xz + wy), y: 2 * (yz - wx), z: 1 - 2 * (xx + yy) },
	};
}

export function integrate(
	q: Readonly<Quat>,
	v: Readonly<Vec3>,
	dt: number,
): Quat {
	const w: Quat = {
		x: v.x * deg2rad,
		y: v.y * deg2rad,
		z: v.z * deg2rad,
		w: 0,
	};
	const dq = multiply(w, q);
	const next: Quat = {
		x: q.x + dq.x * 0.5 * dt,
		y: q.y + dq.y * 0.5 * dt,
		z: q.z + dq.z * 0.5 * dt,
		w: q.w + dq.w * 0.5 * dt,
	};
	return normalize(next);
}
