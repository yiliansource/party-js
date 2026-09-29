import { PartyJSError } from "../errors";
import { createShapeCache } from "./cache";
import { buildRegularPolygonPath } from "./utils";

export interface StarShape {
	type: "star";
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
