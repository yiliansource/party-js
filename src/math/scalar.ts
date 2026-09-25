export const deg2rad = Math.PI / 180;
export const rad2deg = 180 / Math.PI;

export function lerp(a: number, b: number, t: number): number {
	return (1 - t) * a + t * b;
}

export function clamp(v: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, v));
}

export function clamp01(v: number): number {
	return clamp(v, 0, 1);
}
