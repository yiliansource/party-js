import { createShapeCache } from "./cache";

/**
 * A square shape, centered at (0, 0), that can be stretched via an aspect ratio and rounded via a corner radius.
 *
 * @summary Draws a particle as a square.
 *
 * @group Particles
 */
export interface SquareShape {
	type: "square";
	/**
	 * The ratio of width to height for the square.
	 *
	 * @defaultValue 1
	 */
	aspectRatio?: number;
	/**
	 * The inner radius of the corners. This is expected to be non-negative, and will be clamped if
	 * it exceeds half of the width or height of the shape.
	 *
	 * @defaultValue 0
	 */
	cornerRadius?: number;
}

const resolve = createShapeCache();

export function squarePath(
	aspectRatio: number = 1,
	cornerRadius: number = 0,
): Path2D {
	return resolve(`${aspectRatio}:${cornerRadius}`, () =>
		buildSquarePath(aspectRatio, cornerRadius),
	);
}

export function buildSquarePath(
	aspectRatio: number = 1,
	cornerRadius: number = 0,
): Path2D {
	const width = aspectRatio < 1 ? aspectRatio : 1;
	const height = aspectRatio > 1 ? 1 / aspectRatio : 1;

	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const radius = Math.min(cornerRadius, halfWidth, halfHeight);

	const path = new Path2D();
	path.moveTo(-halfWidth + radius, -halfHeight);
	path.lineTo(halfWidth - radius, -halfHeight);
	path.arcTo(halfWidth, -halfHeight, halfWidth, halfHeight, radius); // top-right
	path.lineTo(halfWidth, halfHeight - radius);
	path.arcTo(halfWidth, halfHeight, -halfWidth, halfHeight, radius); // bottom-right
	path.lineTo(-halfWidth + radius, halfHeight);
	path.arcTo(-halfWidth, halfHeight, -halfWidth, -halfHeight, radius); // bottom-left
	path.lineTo(-halfWidth, -halfHeight + radius);
	path.arcTo(-halfWidth, -halfHeight, halfWidth, -halfHeight, radius); // top-left

	return path;
}
