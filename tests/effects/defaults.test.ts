import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { confetti } from "@/effects/confetti";
import { withDefaults } from "@/effects/defaults";
import { sparkles } from "@/effects/sparkles";

import { type FakeBrowser, stubBrowser } from "../browser";

describe("withDefaults", () => {
	const defaults = { count: 30, spread: 45, shapes: ["circle"] };

	test("uses the defaults when no options are given", () => {
		expect(withDefaults(defaults, undefined)).toEqual(defaults);
	});

	test("lets given options override the defaults", () => {
		expect(withDefaults(defaults, { count: 10 })).toEqual({
			count: 10,
			spread: 45,
			shapes: ["circle"],
		});
	});

	test("keeps the default for options that are undefined", () => {
		expect(withDefaults(defaults, { count: undefined })).toEqual(defaults);
	});

	test("keeps falsy values that aren't undefined or null", () => {
		expect(withDefaults(defaults, { count: 0, shapes: [] })).toEqual({
			count: 0,
			spread: 45,
			shapes: [],
		});
	});

	test("keeps options that have no default", () => {
		const result = withDefaults(defaults, {
			reducedMotion: "play" as const,
		});

		expect(result.reducedMotion).toBe("play");
	});

	test("doesn't change the defaults object", () => {
		withDefaults(defaults, { count: 10 });

		expect(defaults.count).toBe(30);
	});
});

describe("built-in effects with undefined options", () => {
	let browser: FakeBrowser;

	beforeEach(() => {
		browser = stubBrowser();
	});

	afterEach(() => {
		browser.restore();
	});

	// a lost default doesn't always throw: an undefined color only fails while drawing (and is reported by the
	// surface), and an undefined count quietly emits nothing. running the effect to its end catches all of these.

	test("confetti() falls back to its defaults for undefined options", () => {
		confetti(
			{ x: 0, y: 0 },
			{ shapes: undefined, colors: undefined, count: undefined },
		);
		browser.runFor(5000);

		expect(browser.reportedErrors).toEqual([]);
		expect(browser.particlesDrawn).toBeGreaterThan(0);
	});

	test("sparkles() falls back to its defaults for undefined options", () => {
		sparkles({ x: 0, y: 0 }, { colors: undefined, count: undefined });
		browser.runFor(5000);

		expect(browser.reportedErrors).toEqual([]);
		expect(browser.particlesDrawn).toBeGreaterThan(0);
	});
});
