import type { Color } from "../color/color";
import type { Quat } from "../math/quat";
import * as quat from "../math/quat";
import type { Vec3 } from "../math/vec3";
import * as vec3 from "../math/vec3";

export type LightingFn = (color: Color, coefficient: number) => Color;

export function computeLightingCoefficient(
	orientation: Readonly<Quat>,
	light: Readonly<Vec3>,
): number {
	return vec3.dot(quat.basis(orientation).z, light);
}

export interface CreateLightingOptions {
	ambient?: number;
	intensity?: number;
}

export function createLighting(
	options: CreateLightingOptions = {},
): LightingFn {
	const ambient = options.ambient ?? 0.5;
	const intensity = options.intensity ?? 1;

	return (color, coefficient) => ({
		...color,
		l: color.l * (ambient + intensity * Math.abs(coefficient)),
	});
}

export const defaultLighting: LightingFn = createLighting();
