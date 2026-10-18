export interface AnimationLoop {
	readonly running: boolean;
	start(): void;
	stop(): void;
}

/**
 * Creates a loop that calls `onFrame` once per animation frame while running.
 *
 * `onFrame` receives the elapsed time since the previous frame, in seconds. On the first frame after each
 * {@link AnimationLoop.start | start()} it receives `null` instead, since there is no previous frame to measure
 * from. This keeps the time spent stopped from being treated as elapsed.
 */
export function createAnimationLoop(
	onFrame: (elapsedSeconds: number | null) => void,
): AnimationLoop {
	let active = false;
	let rafId: number | null = null;
	let previousTime: number | null = null;

	function frame(time: number): void {
		rafId = null; // this frame has fired, nothing to cancel anymore

		const elapsedSeconds =
			previousTime === null ? null : (time - previousTime) / 1000;
		previousTime = time;

		onFrame(elapsedSeconds);

		// onFrame may have stopped the loop, or stopped and started it again (which already queued a frame)
		if (active && rafId === null) rafId = requestAnimationFrame(frame);
	}

	return {
		get running() {
			return active;
		},
		start() {
			if (active) return;

			active = true;
			previousTime = null;
			rafId = requestAnimationFrame(frame);
		},
		stop() {
			active = false;

			if (rafId !== null) cancelAnimationFrame(rafId);
			rafId = null;
		},
	};
}
