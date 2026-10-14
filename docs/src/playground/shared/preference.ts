export function prefersReductionMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
