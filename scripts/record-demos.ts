/**
 * Records built-in effects as demo GIFs for the README.
 *
 * Requires a build, gifski to be installed in PATH and a headless browser to be installed
 * with `bunx playwright install chromium`.
 *
 * Use `--keep-frames` to prevent rendered frames from being deleted from the temporary directory
 * for debugging purposes.
 */

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { styleText } from "node:util";
import { $ } from "bun";

import { chromium } from "playwright";

const repositoryRoot = join(import.meta.dirname, "..");

const options: { id: string; frames: number }[] = [
	{ id: "confetti", frames: 170 },
	{ id: "sparkles", frames: 100 },
];
const keepFrames = process.argv.includes("--keep-frames");

const clear = "\r\x1b[2K";
const dim = (s: string) => styleText("dim", s);
const secs = (start: number) =>
	dim(`${((performance.now() - start) / 1000).toFixed(1)}s`);

function progress(done: number, total: number, label = "frames") {
	if (!process.stdout.isTTY) return;
	const width = 24;
	const filled = Math.round((done / total) * width);
	process.stdout.write(
		`\r${dim(label)} ${"━".repeat(filled)}${dim(`${"─".repeat(width - filled)} ${done}/${total}`)}`,
	);
}

function done(label: string, detail: string, start: number) {
	process.stdout.write(
		`${clear}  ${styleText("green", "✓")} ${label.padEnd(10)}${detail.padEnd(14)}${secs(start)}\n`,
	);
}

const browser = await chromium.launch();
try {
	for (const option of options) {
		const outputFileName = `${option.id}.gif`;
		const outputFilePath = join(
			repositoryRoot,
			".github",
			"assets",
			outputFileName,
		);

		console.log(styleText("bold", outputFileName));

		let t = performance.now();
		const context = await browser.newContext({
			viewport: { width: 480, height: 320 },
			deviceScaleFactor: 1,
			reducedMotion: "no-preference",
		});
		const page = await context.newPage();
		await page.clock.install({ time: 0 });
		await page.goto(
			`${
				pathToFileURL(join(import.meta.dirname, "demo", "index.html"))
					.href
			}?effect=${option.id}`,
		);
		await page.clock.pauseAt(10_000);

		const tmpDir = await mkdtemp(join(tmpdir(), "partyjs-demo-"));
		try {
			const framePaths: string[] = [];
			async function takeScreenshot(i: number) {
				const frameName = `${String(i).padStart(4, "0")}.png`;
				const framePath = join(tmpDir, frameName);
				await page.screenshot({
					path: framePath,
					omitBackground: true,
				});
				framePaths.push(framePath);
			}

			await takeScreenshot(0); // single frame before the effect
			await page.click("button");
			for (let i = 1; i < option.frames; i++) {
				await page.clock.runFor(1000 / 50);
				await takeScreenshot(i);
				progress(i + 1, option.frames, "  ◌ recording...");
			}
			done("recorded", `${option.frames} frames`, t);

			t = performance.now();
			process.stdout.write(`  ${dim("◌ encoding...")}`);
			await $`gifski --fps 50 --quality 90 -o ${outputFilePath} ${framePaths}`.quiet();
			const kib = (Bun.file(outputFilePath).size / 1024).toFixed(0);
			done("encoded", `${kib} KiB`, t);

			console.log(`  → ${relative(process.cwd(), outputFilePath)}`);
			if (keepFrames) console.log(dim(`  · frames kept in ${tmpDir}`));
			console.log();
		} finally {
			if (!keepFrames) {
				await rm(tmpDir, { recursive: true, force: true });
			}
			await context.close();
		}
	}
} finally {
	await browser.close();
}
