export function buildRegularPolygonPath(
	n: number,
	radiusAt: (i: number) => number,
): Path2D {
	const vertices: [number, number][] = [];
	for (let i = 0; i < n; i++) {
		const angle = -Math.PI / 2 + (2 * i * Math.PI) / n;
		const radius = radiusAt(i);
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
