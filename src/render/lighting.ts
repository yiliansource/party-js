import type { Color } from "../color/color";
import type { Quat } from "../math/quat";
import * as quat from "../math/quat";
import type { Vec3 } from "../math/vec3";
import * as vec3 from "../math/vec3";

/**
 * @group Custom effects
 */
export type LightingFn = (color: Color, coefficient: number) => Color;

/**
 * @group Custom effects
 */
export interface CreateLightingOptions {
	ambient?: number;
	intensity?: number;
}

/**
 * @group Custom effects
 */
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

export function computeLightingCoefficient(
	orientation: Readonly<Quat>,
	light: Readonly<Vec3>,
): number {
	return vec3.dot(quat.basis(orientation).z, light);
}
