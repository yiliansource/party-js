import { PartyJSError } from "../errors";
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
	 */
	points?: number;
}

const INNER_TO_OUTER_RATIO = 1 / ((1 + Math.sqrt(5)) / 2) ** 2;

const resolve = createShapeCache();

export function starPath(points: number = 5): Path2D {
	return resolve(`${points}`, () => buildStarPath(points));
}

export function buildStarPath(points: number): Path2D {
	if (!Number.isInteger(points) || points < 3) {
		throw new PartyJSError(
			`star()'s points has to be an integer >= 3, got ${points}`,
		);
	}

	return buildRegularPolygonPath(points * 2, (i) =>
		i % 2 === 0 ? 1 : INNER_TO_OUTER_RATIO,
	);
}
