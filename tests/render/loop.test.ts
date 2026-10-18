import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { createAnimationLoop } from "@/render/loop";

describe("createAnimationLoop", () => {
	const globals = globalThis as Record<string, unknown>;
	let saved: Record<string, unknown>;
	let frames: Map<number, (time: number) => void>;
	let nextId: number;

	beforeEach(() => {
		saved = {
			requestAnimationFrame: globals.requestAnimationFrame,
			cancelAnimationFrame: globals.cancelAnimationFrame,
		};
		frames = new Map();
		nextId = 0;

		globals.requestAnimationFrame = (callback: (time: number) => void) => {
			frames.set(++nextId, callback);
			return nextId;
		};
		globals.cancelAnimationFrame = (id: number) => {
			frames.delete(id);
		};
	});

	afterEach(() => {
		Object.assign(globals, saved);
	});

	function runFrame(time: number): void {
		// runs the oldest queued frame, like the browser would on its next repaint
		const next = frames.entries().next();
		if (next.done) throw new Error("no frame is queued");
		const [id, callback] = next.value;
		frames.delete(id);
		callback(time);
	}

	test("passes null on the first frame, then the elapsed seconds since the previous frame", () => {
		const elapsed: (number | null)[] = [];
		const loop = createAnimationLoop((dt) => elapsed.push(dt));

		loop.start();
		runFrame(1000);
		runFrame(1016);
		runFrame(1048);

		expect(elapsed).toEqual([null, 0.016, 0.032]);
	});

	test("passes null again on the first frame after a restart", () => {
		const elapsed: (number | null)[] = [];
		const loop = createAnimationLoop((dt) => elapsed.push(dt));

		loop.start();
		runFrame(1000);
		loop.stop();
		loop.start();
		runFrame(5000);

		expect(elapsed).toEqual([null, null]);
	});

	test("keeps scheduling frames while running", () => {
		let frameCount = 0;
		const loop = createAnimationLoop(() => frameCount++);

		loop.start();
		runFrame(0);
		runFrame(16);
		runFrame(32);

		expect(frameCount).toBe(3);
		expect(frames.size).toBe(1);
	});

	test("stopping from outside a frame cancels the queued frame", () => {
		const loop = createAnimationLoop(() => {});

		loop.start();
		runFrame(0);
		loop.stop();

		expect(frames.size).toBe(0);
	});

	test("stopping from inside the frame callback schedules no further frames", () => {
		let frameCount = 0;
		const loop = createAnimationLoop(() => {
			frameCount++;
			loop.stop();
		});

		loop.start();
		runFrame(0);

		expect(frameCount).toBe(1);
		expect(frames.size).toBe(0);
	});

	test("stopping and starting again inside the frame callback queues a single frame", () => {
		const elapsed: (number | null)[] = [];
		const loop = createAnimationLoop((dt) => {
			elapsed.push(dt);
			if (elapsed.length === 2) {
				loop.stop();
				loop.start();
			}
		});

		loop.start();
		runFrame(1000);
		runFrame(1016);

		expect(frames.size).toBe(1);

		runFrame(1032);
		expect(elapsed).toEqual([null, 0.016, null]);
	});

	test("reports running while inside the frame callback", () => {
		let runningInside: boolean | undefined;
		const loop = createAnimationLoop(() => {
			runningInside = loop.running;
		});

		loop.start();
		runFrame(0);

		expect(runningInside).toBe(true);
	});

	test("starting twice queues only one frame", () => {
		const loop = createAnimationLoop(() => {});

		loop.start();
		loop.start();

		expect(frames.size).toBe(1);
	});

	test("reports whether it is running", () => {
		const loop = createAnimationLoop(() => {});
		expect(loop.running).toBe(false);

		loop.start();
		expect(loop.running).toBe(true);

		loop.stop();
		expect(loop.running).toBe(false);
	});
});
