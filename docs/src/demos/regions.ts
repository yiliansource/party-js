const REGION =
	/^[ \t]*\/\/\s*#region\s+demo\b[^\n]*\n([\s\S]*?)^[ \t]*\/\/\s*#endregion/gm;

export function demoCode(source: string): string | null {
	const parts = [...source.matchAll(REGION)].map((match) => dedent(match[1]));
	if (parts.length === 0) {
		if (/#(end)?region/.test(source))
			throw new Error(
				"`#region` markers found, but no complete `// #region demo` … `// #endregion` block",
			);
		return null;
	}
	return parts.join("\n\n");
}

function dedent(block: string): string {
	const lines = block.trimEnd().split("\n");
	const indent = Math.min(
		...lines
			.filter((line) => line.trim())
			.map((line) => line.match(/^\s*/)?.[0].length ?? 0),
	);
	return lines
		.map((line) =>
			line
				.slice(indent)
				.replace(/^\t+/, (tabs) => "  ".repeat(tabs.length)),
		)
		.join("\n");
}
