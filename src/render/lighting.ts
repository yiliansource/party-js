import type { Color } from "../color/color";
import type { Quat } from "../math/quat";
import * as quat from "../math/quat";
import { lerp } from "../math/scalar";
import type { Vec3 } from "../math/vec3";
import * as vec3 from "../math/vec3";

/**
 * A function that adjusts a particle's color to account for lighting, called for every particle on every frame.
 *
 * It receives the particle's color and how directly its face points towards the light, from -1 to 1, with 0
 * meaning edge-on. It must return a new color instance, as it should not modify the particle's own color.
 *
 * @summary Adjusts a particle's color for lighting.
 *
 * @group Custom effects
 */
export type LightingFn = (color: Color, coefficient: number) => Color;

/**
 * Options for {@link createLighting | createLighting()}.
 *
 * @summary The strength of ambient and directional light.
 *
 * @group Custom effects
 */
export interface CreateLightingOptions {
	/**
	 * The lightness factor for a particle seen edge-on to the light.
	 *
	 * @defaultValue 0.5
	 */
	ambient?: number;
	/**
	 * The lightness factor for a particle facing the light directly.
	 *
	 * @defaultValue 1
	 */
	peak?: number;
}

/**
 * Creates a {@link LightingFn} that scales a color's lightness by how directly the particle faces
 * the light, from both sides alike.
 *
 * The lightness of a particle is multiplied by a value from `options.ambient` to `options.peak`, which
 * is calculated via interpolation by the lighting coefficient.
 *
 * @param options - The ambient and peak lightness factors.
 *
 * @summary Creates a lighting function that brightens particles facing the light.
 *
 * @group Custom effects
 */
export function createLighting(options?: CreateLightingOptions): LightingFn {
	const ambient = options?.ambient ?? 0.5;
	const peak = options?.peak ?? 1;

	return (color, coefficient) => ({
		...color,
		l: color.l * lerp(ambient, peak, Math.abs(coefficient)),
	});
}

export const defaultLighting: LightingFn = createLighting();

export function computeLightingCoefficient(
	orientation: Readonly<Quat>,
	light: Readonly<Vec3>,
): number {
	return vec3.dot(quat.basis(orientation).z, light);
}
