import { createShapeCache } from "./cache";

export interface SquareShape {
	type: "square";
	aspectRatio?: number;
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
