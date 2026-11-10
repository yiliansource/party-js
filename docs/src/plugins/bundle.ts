import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "tsup";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:party-js-bundle";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const root = fileURLToPath(new URL("../../../", import.meta.url));
const srcDir = join(root, "src");

/**
 * Bundles the library into a single, self-contained ES module, the same way `bun run build` produces
 * dist/index.js, so the docs don't depend on a prior library build.
 */
async function bundleLibrary(): Promise<string> {
	const outDir = await mkdtemp(join(tmpdir(), "party-js-bundle-"));
	try {
		await build({
			config: false,
			entry: { index: join(srcDir, "index.ts") },
			tsconfig: join(root, "tsconfig.json"),
			format: ["esm"],
			// Unminified, so stack traces into the library keep their function names.
			minify: false,
			sourcemap: false,
			outDir,
			silent: true,
		});
		return await readFile(join(outDir, "index.js"), "utf8");
	} finally {
		await rm(outDir, { recursive: true, force: true });
	}
}

/**
 * Exposes the bundled party.js source as `virtual:party-js-bundle`, e.g. for the code playground's sandbox, which
 * can't import modules from the docs' origin. In dev, the module is rebuilt whenever a library source file changes.
 */
export function partyJsBundle(): Plugin {
	return {
		name: "party-js-bundle",
		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_ID;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return;
			return `export default ${JSON.stringify(await bundleLibrary())};`;
		},
		configureServer(server) {
			server.watcher.add(srcDir);
			server.watcher.on("change", (file) => {
				if (!file.startsWith(srcDir)) return;
				for (const environment of Object.values(server.environments)) {
					const module =
						environment.moduleGraph.getModuleById(RESOLVED_ID);
					if (module)
						environment.moduleGraph.invalidateModule(module);
				}
			});
		},
	};
}
