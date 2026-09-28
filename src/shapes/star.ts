import { PartyJSError } from "../errors";
import { createShapeCache } from "./cache";

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

	const vertices: [number, number][] = [];
	for (let i = 0; i < points * 2; i++) {
		const radius = i % 2 === 0 ? 1 : INNER_TO_OUTER_RATIO;
		const angle = -Math.PI / 2 + (i * Math.PI) / points;
		vertices.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
	}

	const xs = vertices.map(([x]) => x);
	const ys = vertices.map(([, y]) => y);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const scale = 1 / Math.max(maxX - minX, maxY - minY);
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	const path = new Path2D();
	vertices.forEach(([x, y], i) => {
		const sx = (x - centerX) * scale;
		const sy = (y - centerY) * scale;
		if (i === 0) path.moveTo(sx, sy);
		else path.lineTo(sx, sy);
	});
	path.closePath();

	return path;
}
