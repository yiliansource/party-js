/**
 * A vector in 2D space, usually used to represent something in page or canvas coordinates.
 *
 * @summary A 2D vector.
 *
 * @group Utilities
 */
export interface Vec2 {
	x: number;
	y: number;
}

export const zero: Readonly<Vec2> = Object.freeze({ x: 0, y: 0 });
