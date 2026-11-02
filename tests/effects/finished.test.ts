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

describe("Effect.end", () => {
	// a stream that never ends by itself, of particles that live for 100ms
	const stream = () =>
		options({
			schedule: { rate: 50, loops: Number.POSITIVE_INFINITY },
			particleInit: {
				size: 10,
				color: "#ff5a5f",
				shape: { type: "circle" },
				lifetime: 0.1,
			},
		});

	test('lets the particles that are alive finish, then resolves with "completed"', async () => {
		const effect = createEffect(stream());
		browser.runFor(500);

		effect.end();
		// the particles in the air are still drawn after end()
		const drawnBefore = browser.particlesDrawn;
		browser.runFrame(516);
		expect(browser.particlesDrawn).toBeGreaterThan(drawnBefore);
		expect(await isSettled(effect.finished)).toBe(false);

		for (let time = 532; time <= 800; time += 16) browser.runFrame(time);

		expect(await effect.finished).toBe("completed");
	});

	test("stops emitting, so the effect ends even though its schedule runs forever", async () => {
		const effect = createEffect(stream());
		browser.runFor(500);

		effect.end();
		for (let time = 516; time <= 800; time += 16) browser.runFrame(time);
		const drawnAfterEnd = browser.particlesDrawn;
		for (let time = 816; time <= 1200; time += 16) browser.runFrame(time);

		expect(await effect.finished).toBe("completed");
		expect(browser.particlesDrawn).toBe(drawnAfterEnd);
	});

	test('resolves with "stopped" when stopped before the particles have expired', async () => {
		const effect = createEffect(stream());
		browser.runFor(500);

		effect.end();
		effect.stop();

		expect(await effect.finished).toBe("stopped");
	});

	test("keeps the particles of a paused effect frozen until it's resumed", async () => {
		const effect = createEffect(stream());
		browser.runFor(500);
		effect.pause();

		effect.end();
		for (let time = 516; time <= 1000; time += 16) browser.runFrame(time);
		expect(await isSettled(effect.finished)).toBe(false);

		effect.resume();
		for (let time = 1016; time <= 1400; time += 16) browser.runFrame(time);

		expect(await effect.finished).toBe("completed");
	});

	test("ends an effect whose particles have all expired, even while it's paused", async () => {
		const effect = createEffect(
			options({
				schedule: { rate: 1, loops: Number.POSITIVE_INFINITY },
			}),
		);
		browser.runFrame(0);
		effect.pause();

		effect.end();
		browser.runFrame(16);

		expect(await effect.finished).toBe("completed");
	});

	test("does nothing when called again, or after the effect has ended", async () => {
		const effect = createEffect(options());
		runUntilDone();

		effect.end();
		effect.end();

		expect(await effect.finished).toBe("completed");
	});

	test("does nothing on a skipped effect", async () => {
		browser.prefersReducedMotion = true;
		const effect = createEffect(stream());

		effect.end();

		expect(await effect.finished).toBe("completed");
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
