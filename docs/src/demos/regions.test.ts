/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { demoCode } from "./regions";

const source = (...lines: string[]) => lines.join("\n");

describe("demoCode", () => {
	test("returns null without any regions", () => {
		expect(demoCode(source("const a = 1;"))).toBeNull();
	});

	test("returns the code of a demo region, dedented, with tabs as 4 spaces", () => {
		const code = demoCode(
			source(
				"export const run = () => {",
				"\t// #region demo",
				"\tconfetti(button, {",
				"\t\tcount: 40,",
				"\t});",
				"\t// #endregion",
				"};",
			),
		);
		expect(code).toBe(
			source("confetti(button, {", "    count: 40,", "});"),
		);
	});

	test("separates multiple demo regions with a blank line", () => {
		const code = demoCode(
			source(
				"// #region demo",
				"const a = 1;",
				"// #endregion",
				"skipped();",
				"// #region demo",
				"const b = 2;",
				"// #endregion",
			),
		);
		expect(code).toBe(source("const a = 1;", "", "const b = 2;"));
	});

	describe("import", () => {
		test("shows the imports before the demo code, even when they come later in the file", () => {
			const code = demoCode(
				source(
					"// #region demo",
					"confetti(button);",
					"// #endregion",
					"// #region import",
					'import { confetti } from "party-js";',
					"// #endregion",
				),
			);
			expect(code).toBe(
				source(
					'import { confetti } from "party-js";',
					"",
					"confetti(button);",
				),
			);
		});

		test("keeps multiple import regions together, without a blank line", () => {
			const code = demoCode(
				source(
					"// #region import",
					'import { confetti } from "party-js";',
					"// #endregion",
					"// #region import",
					'import { range } from "party-js";',
					"// #endregion",
					"// #region demo",
					"confetti(button);",
					"// #endregion",
				),
			);
			expect(code).toBe(
				source(
					'import { confetti } from "party-js";',
					'import { range } from "party-js";',
					"",
					"confetti(button);",
				),
			);
		});

		test("throws without a demo region", () => {
			expect(() =>
				demoCode(
					source(
						"// #region import",
						'import "party-js";',
						"// #endregion",
					),
				),
			).toThrow("no `demo` region");
		});
	});

	describe("collapse", () => {
		test("replaces the region with `// ...`, at the marker's indentation", () => {
			const code = demoCode(
				source(
					"\t// #region demo",
					"\tcreateEffect({",
					"\t\torigin,",
					"\t\t// #region collapse",
					"\t\tschedule: { bursts: [{ count: 30 }] },",
					"\t\tparticleInit: {},",
					"\t\t// #endregion",
					"\t\tbehaviors: [gravity(800)],",
					"\t});",
					"\t// #endregion",
				),
			);
			expect(code).toBe(
				source(
					"createEffect({",
					"    origin,",
					"    // ...",
					"    behaviors: [gravity(800)],",
					"});",
				),
			);
		});

		test("works inside import regions", () => {
			const code = demoCode(
				source(
					"// #region import",
					"// #region collapse",
					'import { a } from "a";',
					"// #endregion",
					'import { confetti } from "party-js";',
					"// #endregion",
					"// #region demo",
					"confetti(button);",
					"// #endregion",
				),
			);
			expect(code).toBe(
				source(
					"// ...",
					'import { confetti } from "party-js";',
					"",
					"confetti(button);",
				),
			);
		});

		test("collapses nested collapse regions into a single `// ...`", () => {
			const code = demoCode(
				source(
					"// #region demo",
					"// #region collapse",
					"a();",
					"// #region collapse",
					"b();",
					"// #endregion",
					"c();",
					"// #endregion",
					"d();",
					"// #endregion",
				),
			);
			expect(code).toBe(source("// ...", "d();"));
		});

		test("throws outside an import or demo region", () => {
			expect(() =>
				demoCode(
					source("// #region collapse", "a();", "// #endregion"),
				),
			).toThrow("must be inside");
		});
	});

	describe("omit", () => {
		test("removes the region without a trace", () => {
			const code = demoCode(
				source(
					"// #region demo",
					"createEffect({",
					"\tparticleInit,",
					"\t// #region omit",
					"\tbehaviors: [scale(0.1, 0.5)],",
					"\t// #endregion",
					"});",
					"// #endregion",
				),
			);
			expect(code).toBe(
				source("createEffect({", "    particleInit,", "});"),
			);
		});

		test("hides collapse regions inside it, without a `// ...`", () => {
			const code = demoCode(
				source(
					"// #region demo",
					"a();",
					"// #region omit",
					"// #region collapse",
					"b();",
					"// #endregion",
					"// #endregion",
					"c();",
					"// #endregion",
				),
			);
			expect(code).toBe(source("a();", "c();"));
		});

		test("inside a collapse region, still results in a single `// ...`", () => {
			const code = demoCode(
				source(
					"// #region demo",
					"// #region collapse",
					"a();",
					"// #region omit",
					"b();",
					"// #endregion",
					"// #endregion",
					"c();",
					"// #endregion",
				),
			);
			expect(code).toBe(source("// ...", "c();"));
		});

		test("throws outside an import or demo region", () => {
			expect(() =>
				demoCode(source("// #region omit", "a();", "// #endregion")),
			).toThrow("`#region omit` must be inside");
		});

		test("can be combined with collapse regions", () => {
			const code = demoCode(
				source(
					"export const run: Demo = ({ target }) => {",
					"\tconst { origin } = emissionTarget(target);",
					"",
					"\t// #region demo",
					"\tcreateEffect({",
					"\t\t// #region collapse",
					"\t\torigin,",
					"\t\tschedule: { bursts: [{ count: range(10, 20) }] },",
					"\t\t// #endregion",
					"\t\tparticleInit: {",
					"\t\t\tposition: ring(120),",
					"\t\t\t// #region collapse",
					"\t\t\tsize: 16,",
					"\t\t\tlifetime: 2,",
					"\t\t\t// #endregion",
					"\t\t},",
					"\t\t// #region omit",
					"\t\tbehaviors: [scale(0.1, 0.5)],",
					"\t\t// #endregion",
					"\t});",
					"\t// #endregion",
					"};",
				),
			);
			expect(code).toBe(
				source(
					"createEffect({",
					"    // ...",
					"    particleInit: {",
					"        position: ring(120),",
					"        // ...",
					"    },",
					"});",
				),
			);
		});
	});

	describe("invalid markers", () => {
		test("throws on an unknown region name, with its line", () => {
			expect(() =>
				demoCode(source("", "// #region colapse", "// #endregion")),
			).toThrow('Unknown region "colapse" (line 2)');
		});

		test("throws on a region that's never closed", () => {
			expect(() => demoCode(source("// #region demo", "a();"))).toThrow(
				"never closed",
			);
		});

		test("throws on an #endregion without a #region", () => {
			expect(() => demoCode(source("a();", "// #endregion"))).toThrow(
				"without a matching",
			);
		});

		test("throws on nested demo regions", () => {
			expect(() =>
				demoCode(
					source(
						"// #region demo",
						"// #region demo",
						"// #endregion",
						"// #endregion",
					),
				),
			).toThrow("can't be nested");
		});
	});
});
