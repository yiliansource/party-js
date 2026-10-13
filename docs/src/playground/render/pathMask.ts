const SIZE = 3 * 32;

export function pathMask(path: Path2D): string {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = SIZE;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("failed to acquire context from canvas");
	ctx.setTransform(SIZE, 0, 0, SIZE, SIZE / 2, SIZE / 2);
	ctx.fill(path);
	return `url(${canvas.toDataURL()})`;
}
