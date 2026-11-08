import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "tsup";
import type { Plugin } from "vite";

const VIRTUAL_ID = "virtual:party-js-types";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const root = fileURLToPath(new URL("../../../", import.meta.url));
const srcDir = join(root, "src");

/**
 * Bundles the library's type declarations into a single string, the same way `bun run build` produces
 * dist/index.d.ts, so the docs don't depend on a prior library build.
 */
async function bundleDeclarations(): Promise<string> {
	const outDir = await mkdtemp(join(tmpdir(), "party-js-types-"));
	try {
		await build({
			config: false,
			entry: { index: join(srcDir, "index.ts") },
			tsconfig: join(root, "tsconfig.json"),
			format: ["esm"],
			dts: { only: true, compilerOptions: { ignoreDeprecations: "6.0" } },
			outDir,
			silent: true,
		});
		return await readFile(join(outDir, "index.d.ts"), "utf8");
	} finally {
		await rm(outDir, { recursive: true, force: true });
	}
}

/**
 * Exposes the bundled party.js declarations as `virtual:party-js-types`, e.g. for the code playground's
 * editor. In dev, the module is rebuilt whenever a library source file changes.
 */
export function partyJsTypes(): Plugin {
	return {
		name: "party-js-types",
		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_ID;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return;
			return `export default ${JSON.stringify(await bundleDeclarations())};`;
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
