import ts from "typescript";

/**
 * The kinds of `// #region` blocks a demo file can use to choose which of its code is shown:
 * - `import`: the imports, shown first.
 * - `demo`: the code that's shown, in the order it appears.
 * - `collapse`: code inside an `import` or `demo` block that's left out, and shown as `// ...` instead.
 * - `omit`: code inside an `import` or `demo` block that should be stripped entirely.
 */
const KINDS = ["import", "demo", "collapse", "omit"] as const;
type RegionKind = (typeof KINDS)[number];

const REGION_START = /^([ \t]*)\/\/\s*#region\s+(\S+)/;
const REGION_END = /^[ \t]*\/\/\s*#endregion\b/;
const COLLAPSED = "// ...";

interface OpenRegion {
	kind: RegionKind;
	/**
	 * Where the region's lines go, or `null` for a collapsed or omitted region, whose lines are dropped.
	 */
	lines: string[] | null;
}

/**
 * Extracts the code to show for a demo from its source, or `null` if it has no `#region` blocks.
 *
 * Throws on unknown, unbalanced or misplaced `#region` markers, so mistakes fail the build instead of
 * showing the wrong code.
 */
export function demoCode(source: string): string | null {
	const imports: string[][] = [];
	const demos: string[][] = [];
	const open: OpenRegion[] = [];

	for (const [index, line] of source.split("\n").entries()) {
		const at = `line ${index + 1}`;
		const start = line.match(REGION_START);

		if (start) {
			const [, indent, name] = start;
			if (!isRegionKind(name))
				throw new Error(
					`Unknown region "${name}" (${at}). Use one of: ${KINDS.join(", ")}.`,
				);

			if (name === "collapse" || name === "omit") {
				const parent = open.at(-1);
				if (!parent)
					throw new Error(
						`\`#region ${name}\` must be inside an \`import\` or \`demo\` region (${at}).`,
					);
				// inside a region that's already hidden, parent.lines is null and nothing is added
				if (name === "collapse") parent.lines?.push(indent + COLLAPSED);
				open.push({ kind: name, lines: null });
			} else {
				if (open.length > 0)
					throw new Error(
						`\`#region ${name}\` can't be nested inside \`#region ${open[0].kind}\` (${at}).`,
					);
				const lines: string[] = [];
				(name === "import" ? imports : demos).push(lines);
				open.push({ kind: name, lines });
			}
			continue;
		}

		if (REGION_END.test(line)) {
			if (!open.pop())
				throw new Error(
					`\`#endregion\` without a matching \`#region\` (${at}).`,
				);
			continue;
		}

		open.at(-1)?.lines?.push(line);
	}

	if (open.length > 0)
		throw new Error(
			`\`#region ${open.at(-1)?.kind}\` is never closed with \`#endregion\`.`,
		);

	if (demos.length === 0) {
		if (imports.length > 0)
			throw new Error("Found an `import` region, but no `demo` region.");
		return null;
	}

	const blocks = (parts: string[][]) =>
		parts.map((lines) => dedent(lines)).filter((block) => block !== "");

	const result = [blocks(imports).join("\n"), ...blocks(demos)]
		.filter((block) => block !== "")
		.join("\n\n");

	assertPlainJs(result);
	return result;
}

function isRegionKind(name: string): name is RegionKind {
	return (KINDS as readonly string[]).includes(name);
}

function dedent(lines: string[]): string {
	const text = lines.join("\n").trimEnd();
	if (text.trim() === "") return "";

	const rows = text.split("\n");
	const indent = Math.min(
		...rows
			.filter((line) => line.trim())
			.map((line) => line.match(/^\s*/)?.[0].length ?? 0),
	);
	return rows
		.map((line) =>
			line
				.slice(indent)
				.replace(/^\t+/, (tabs) => " ".repeat(4).repeat(tabs.length)),
		)
		.join("\n");
}

/**
 * Throws if the given code uses TypeScript-only syntax.
 */
function assertPlainJs(code: string): void {
	const { diagnostics = [] } = ts.transpileModule(code, {
		fileName: "demo.js",
		reportDiagnostics: true,
	});
	const [first] = diagnostics;
	if (!first) return;

	const line = code.slice(0, first.start).split("\n").length;
	throw new Error(
		`Shown demo code must be plain JavaScript, line ${line} of the shown code: ${ts.flattenDiagnosticMessageText(first.messageText, "\n")}`,
	);
}
