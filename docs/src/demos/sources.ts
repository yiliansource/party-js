import { byDemoName } from "./names";
import { demoCode } from "./regions";

// server only: this pulls in the raw source of every demo, and `regions.ts` imports TypeScript
const sources = byDemoName(
	import.meta.glob<string>("./*.demo.{js,ts}", {
		query: "?raw",
		import: "default",
		eager: true,
	}),
);

/**
 * The code to show for a demo, as extracted by its `#region` blocks, or `null` if it has none.
 */
export function demoSnippet(name: string): string | null {
	const source = sources.get(name);
	if (source === undefined) throw new Error(`[demos] unknown demo "${name}"`);
	return demoCode(source);
}
