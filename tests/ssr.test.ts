import { expect, test } from "bun:test";

// a plain Bun process has no DOM, like a server - the test preload polyfills Path2D, so this has to run outside it.
test("importing party.js works without a browser", () => {
	const result = Bun.spawnSync([
		process.execPath,
		"-e",
		"await import('./src/index.ts')",
	]);

	expect(result.stderr.toString()).toBe("");
	expect(result.exitCode).toBe(0);
});
