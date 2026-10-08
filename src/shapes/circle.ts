/**
 * @group Particles
 */
export interface CircleShape {
	type: "circle";
}

const cachedPath = buildCirclePath();

export function circlePath(): Path2D {
	return cachedPath;
}

export function buildCirclePath(): Path2D {
	const path = new Path2D();
	path.moveTo(0, -0.5);
	path.arc(0, 0, 0.5, 0, 2 * Math.PI);
	return path;
}
