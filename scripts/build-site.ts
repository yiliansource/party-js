#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, "dist-site");

const PLAYGROUNDS = ["particles", "shapes", "effects"] as const;

function run(command: string, cwd: string): void {
	console.log(`\n$ ${command}\n  (in ${path.relative(ROOT, cwd) || "."})`);
	execSync(command, { cwd, stdio: "inherit" });
}

async function buildDocs(): Promise<void> {
	const docsDir = path.join(ROOT, "docs");
	run("bun install --frozen-lockfile", docsDir);
	run("bun run build", docsDir);
	await cp(path.join(docsDir, "dist"), OUT_DIR, { recursive: true });
}

async function buildPlayground(name: string): Promise<void> {
	const pgDir = path.join(ROOT, "playground", name);
	const base = `/playgrounds/${name}/`;

	run("bun install --frozen-lockfile", pgDir);
	run(`bun run build -- --base=${base}`, pgDir);

	const dest = path.join(OUT_DIR, "playgrounds", name);
	await mkdir(dest, { recursive: true });
	await cp(path.join(pgDir, "dist"), dest, { recursive: true });
}

async function main(): Promise<void> {
	await rm(OUT_DIR, { recursive: true, force: true });
	await mkdir(OUT_DIR, { recursive: true });

	run("bun install --frozen-lockfile", ROOT);

	await buildDocs();

	run("bun install --frozen-lockfile", path.join(ROOT, "playground", "ui"));
	for (const name of PLAYGROUNDS) {
		await buildPlayground(name);
	}

	console.log(`\nSite assembled at ${path.relative(ROOT, OUT_DIR)}/`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
