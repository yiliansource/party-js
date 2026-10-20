const DEMO_FILE = /\/([^/]+)\.demo\.[jt]s$/;

export function byDemoName<T>(files: Record<string, T>): Map<string, T> {
	const demos = new Map<string, T>();
	for (const [path, value] of Object.entries(files)) {
		const name = path.match(DEMO_FILE)?.[1];
		if (name === undefined) continue;
		if (demos.has(name))
			throw new Error(
				`[demos] "${name}" exists as both a .ts and a .js file.`,
			);
		demos.set(name, value);
	}
	return demos;
}
