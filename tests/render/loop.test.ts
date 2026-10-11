import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { createAnimationLoop, tick } from "@/render/loop";

function makeFakeLoop() {
	const calls: number[] = [];
	return {
		calls,
		advance(elapsedSeconds: number) {
			calls.push(elapsedSeconds);
			return 0;
		},
	};
}

describe("tick", () => {
	test("skips advance() on the first tick (no previous timestamp) but still renders", () => {
		const loop = makeFakeLoop();
		let renders = 0;

		tick(loop, () => renders++, null, 1000);

		expect(loop.calls).toEqual([]);
		expect(renders).toBe(1);
	});

	test("converts the millisecond timestamp delta to elapsed seconds", () => {
		const loop = makeFakeLoop();

		tick(loop, () => {}, 1000, 1016);

		expect(loop.calls).toEqual([0.016]);
	});

	test("renders exactly once per tick, regardless of the elapsed time", () => {
		const loop = makeFakeLoop();
		let renders = 0;

		tick(loop, () => renders++, 1000, 5000);

		expect(renders).toBe(1);
	});
});

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

	test("keeps scheduling frames while running", () => {
		let renders = 0;
		const loop = createAnimationLoop(makeFakeLoop(), () => renders++);

		loop.start();
		runFrame(0);
		runFrame(16);
		runFrame(32);

		expect(renders).toBe(3);
		expect(frames.size).toBe(1);
	});

	test("stopping from outside a frame cancels the queued frame", () => {
		const loop = createAnimationLoop(makeFakeLoop(), () => {});

		loop.start();
		runFrame(0);
		loop.stop();

		expect(frames.size).toBe(0);
	});

	test("stopping from inside the render callback schedules no further frames", () => {
		let renders = 0;
		const loop = createAnimationLoop(makeFakeLoop(), () => {
			renders++;
			loop.stop();
		});

		loop.start();
		runFrame(0);

		expect(renders).toBe(1);
		expect(frames.size).toBe(0);
	});

	test("starting twice queues only one frame", () => {
		const loop = createAnimationLoop(makeFakeLoop(), () => {});

		loop.start();
		loop.start();

		expect(frames.size).toBe(1);
	});
});
