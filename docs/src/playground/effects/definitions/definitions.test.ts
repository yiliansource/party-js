import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { toText } from "../../shared/tokens";
import { createEffectDraft, effectCode } from "../effect";
import { fieldCode } from "../fields";
import { confettiDefinition } from "./confetti";
import { sparklesDefinition } from "./sparkles";

const cases = [
	{ definition: confettiDefinition, source: "confetti.ts" },
	{ definition: sparklesDefinition, source: "sparkles.ts" },
];
describe.each(cases)("$definition.call", ({ definition, source }) => {
	const effectSource = readFileSync(
		new URL(`../../../../../src/effects/${source}`, import.meta.url),
		"utf8",
	);

	function documentedDefault(key: string): string {
		const match = effectSource.match(
			new RegExp(`@defaultValue ([^\\n]+)\\n\\s*\\*/\\n\\s*${key}\\?:`),
		);
		if (!match)
			throw new Error(
				`no @defaultValue found for ConfettiOptions.${key}`,
			);

		return match[1].trim();
	}

	test.each(definition.fields.map((f) => [f.key, f] as const))(
		"the playground's default for %s matches the library's @defaultValue",
		(key, field) => {
			expect(toText(fieldCode(field, field.default).tokens)).toBe(
				documentedDefault(key),
			);
		},
	);

	test("an untouched draft generates a call without options", () => {
		expect(
			toText(effectCode(definition, createEffectDraft(definition))),
		).toBe(
			`import { ${definition.call} } from "party-js";\n\n${definition.call}(element);`,
		);
	});

	test("every field belongs to one of the definition's groups", () => {
		const groups = new Set(definition.groups.map((g) => g.id));
		for (const f of definition.fields) expect(groups).toContain(f.group);
	});

	test("field keys are unique", () => {
		const keys = definition.fields.map((f) => f.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	test("numeric defaults are allowed by their own field", () => {
		for (const f of definition.fields.filter((f) => f.type === "numeric")) {
			expect(f.forms).toContain(f.default.form);
			const values =
				f.default.form === "fixed"
					? [f.default.value]
					: [f.default.min, f.default.max];

			for (const v of values)
				expect(v).toBeWithin(f.min, f.max + Number.EPSILON);
		}
	});
});
