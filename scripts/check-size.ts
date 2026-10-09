import { appendFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const FILE = "bundle/party.min.js";
const LIMIT = 10 * 1024;

const raw = await Bun.file(FILE).bytes();
const gzipped = gzipSync(raw).byteLength;

const kib = (bytes: number) => `${(bytes / 1024).toFixed(2)} KiB`;
const report = `${FILE}: ${kib(gzipped)} gzipped, limit ${kib(LIMIT)} (${kib(raw.byteLength)} minified)`;
console.log(report);

if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(
		process.env.GITHUB_STEP_SUMMARY,
		`### Bundle size\n\n${report}\n`,
	);
}

if (gzipped > LIMIT) {
	console.error(`Bundle exceeds the size limit by ${kib(gzipped - LIMIT)}.`);
	process.exit(1);
}
