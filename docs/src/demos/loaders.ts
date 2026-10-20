import { byDemoName } from "./names";
import type { Demo } from "./types";

// client side: each demo stays in its own chunk, and is only loaded when it's needed
const loaders = byDemoName(
	import.meta.glob<Demo>("./*.demo.{js,ts}", { import: "run" }),
);

/**
 * Loads a demo's `run` function.
 */
export function loadDemo(name: string): Promise<Demo> {
	const load = loaders.get(name);
	if (load === undefined) throw new Error(`[demos] unknown demo "${name}"`);
	return load();
}
