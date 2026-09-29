import { describe, expect, test } from "bun:test";

import { tick } from "@/render/loop";

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
