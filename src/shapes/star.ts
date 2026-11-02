import { invalidOption } from "../errors";
import { createShapeCache } from "./cache";
import { buildRegularPolygonPath } from "./utils";

/**
 * A regular, pointed star, centered at (0, 0), with a specified number of points.
 *
 * @summary Draws a particle as a regular, pointed star.
 *
 * @group Particles
 */
export interface StarShape {
	type: "star";
	/**
	 * The number of points the star should have, which is expected to be an integer >= 3.
	 *
	 * @defaultValue 5
	 */
	points?: number;
	/**
	 * How far the inner corners between the points are from the center, relative to the points themselves, from
	 * just above 0 (thin, spiky points) to 1 (no points at all). The default gives the proportions of a classic
	 * five-pointed star.
	 *
	 * @defaultValue 0.382
	 */
	innerRadius?: number;
}

export const DEFAULT_STAR_INNER_RADIUS = 1 / ((1 + Math.sqrt(5)) / 2) ** 2;

const resolve = createShapeCache();

export function starPath(
	points = 5,
	innerRadius = DEFAULT_STAR_INNER_RADIUS,
): Path2D {
	return resolve(`${points}:${innerRadius}`, () =>
		buildStarPath(points, innerRadius),
	);
}

export function buildStarPath(
	points: number,
	innerRadius = DEFAULT_STAR_INNER_RADIUS,
): Path2D {
	if (!Number.isInteger(points) || points < 3) {
		throw invalidOption(
			"star shape's points",
			"an integer of at least 3",
			points,
		);
	}

	if (!(innerRadius > 0 && innerRadius <= 1)) {
		throw invalidOption(
			"star shape's innerRadius",
			"greater than 0 and at most 1",
			innerRadius,
		);
	}

	return buildRegularPolygonPath(points * 2, (i) =>
		i % 2 === 0 ? 1 : innerRadius,
	);
}
