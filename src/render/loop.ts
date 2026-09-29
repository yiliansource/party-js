import type { FixedTimestepLoop } from "../physics/loop";

/**
 * Advances the provided loop by the elapsed time between two given timestamps (in milliseconds),
 * timestamps (in milliseconds, as RAF provides them), then renders exactly once.
 *
 * The previous timestamp will be null on the first tick, which will result in a plain render without advancing the loop.
 */
export function tick(
	loop: FixedTimestepLoop,
	render: () => void,
	previousTime: number | null,
	currentTime: number,
): void {
	if (previousTime !== null) {
		const elapsedSeconds = (currentTime - previousTime) / 1000;
		loop.advance(elapsedSeconds);
	}
	render();
}

export interface AnimationLoop {
	start(): void;
	stop(): void;
}

export function createAnimationLoop(
	loop: FixedTimestepLoop,
	render: () => void,
): AnimationLoop {
	let rafId: number | null = null;
	let previousTime: number | null = null;

	function frame(time: number): void {
		tick(loop, render, previousTime, time);

		previousTime = time;
		rafId = requestAnimationFrame(frame);
	}

	return {
		start() {
			if (rafId !== null) return;

			previousTime = null;
			rafId = requestAnimationFrame(frame);
		},
		stop() {
			if (rafId !== null) cancelAnimationFrame(rafId);

			rafId = null;
		},
	};
}
