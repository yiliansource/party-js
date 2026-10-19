import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { confetti } from "@/effects/confetti";
import {
	type CreateEffectOptions,
	createEffect as createEffectUntracked,
	type Effect,
} from "@/effects/effect";
import { sparkles } from "@/effects/sparkles";

import { type FakeBrowser, stubBrowser } from "../browser";

let browser: FakeBrowser;
let effects: Effect[];

beforeEach(() => {
	browser = stubBrowser();
	effects = [];
});

afterEach(() => {
	// the shared overlay is module state, so no effect may outlive its test, even a failing one
	for (const effect of effects) effect.stop();
	browser.restore();
});

function createEffect(options: CreateEffectOptions): Effect {
	const effect = createEffectUntracked(options);
	effects.push(effect);
	return effect;
}

function options(
	overrides: Partial<CreateEffectOptions> = {},
): CreateEffectOptions {
	return {
		origin: { x: 0, y: 0 },
		schedule: { duration: 0.05, bursts: [{ count: 1 }] },
		particleInit: {
			size: 10,
			color: "#ff5a5f",
			shape: { type: "circle" },
			lifetime: 0.05,
		},
		...overrides,
	};
}

// Gives the effect time to finish: its schedule and its single particle both last 50ms.
function runUntilDone(): void {
	browser.runFor(200);
}

// Tells whether a promise has settled, without waiting for it to.
async function isSettled(promise: Promise<unknown>): Promise<boolean> {
	const pending = Symbol("pending");
	return (
		(await Promise.race([promise, Promise.resolve(pending)])) !== pending
	);
}

describe("Effect.finished", () => {
	test('resolves with "completed" once the effect ends by itself', async () => {
		const effect = createEffect(options());

		runUntilDone();

		expect(await effect.finished).toBe("completed");
	});

	test("stays pending while the effect is still running", async () => {
		const effect = createEffect(options());

		browser.runFrame(0);

		expect(await isSettled(effect.finished)).toBe(false);
	});

	test('resolves with "stopped" when the effect is stopped early', async () => {
		const effect = createEffect(options());

		effect.stop();

		expect(await effect.finished).toBe("stopped");
	});

	test("keeps its first result when the effect is stopped after completing", async () => {
		const effect = createEffect(options());
		runUntilDone();

		effect.stop();

		expect(await effect.finished).toBe("completed");
	});

	test('resolves with "stopped" when the effect throws while running, instead of never settling', async () => {
		const effect = createEffect(
			options({
				behaviors: [
					{
						update() {
							throw new Error("broken behavior");
						},
					},
				],
			}),
		);

		runUntilDone();

		expect(await effect.finished).toBe("stopped");
		expect(browser.reportedErrors).toHaveLength(1);
	});

	test("stays pending while the effect is paused", async () => {
		const effect = createEffect(options());
		browser.runFrame(0);

		effect.pause();
		runUntilDone();

		expect(await isSettled(effect.finished)).toBe(false);
	});
});

describe("Effect.finished on a skipped effect", () => {
	beforeEach(() => {
		browser.prefersReducedMotion = true;
	});

	test('resolves with "completed"', async () => {
		const effect = createEffect(options());

		expect(await effect.finished).toBe("completed");
	});

	test('resolves with "stopped" when stopped before it completes', async () => {
		const effect = createEffect(options());

		effect.stop();

		expect(await effect.finished).toBe("stopped");
	});
});

describe("built-in effects", () => {
	test("confetti() can be awaited", async () => {
		browser.prefersReducedMotion = true;

		expect(await confetti({ x: 0, y: 0 }).finished).toBe("completed");
	});

	test("sparkles() can be awaited", async () => {
		browser.prefersReducedMotion = true;

		expect(await sparkles({ x: 0, y: 0 }).finished).toBe("completed");
	});
});
