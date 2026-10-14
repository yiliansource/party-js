import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { toText } from "../../code";
import { createEffectDraft, effectCode, effectOptions } from "../effect";
import { fieldCode } from "../fields";
import { sparklesDefinition } from "./sparkles";

const source = readFileSync(
	new URL("../../../../../src/effects/sparkles.ts", import.meta.url),
	"utf8",
);

/**
 * Reads the `@defaultValue` tag written on an option in the library's source.
 */
function documentedDefault(key: string): string {
	const match = source.match(
		new RegExp(`@defaultValue ([^\\n]+)\\n\\s*\\*/\\n\\s*${key}\\?:`),
	);
	if (!match)
		throw new Error(`no @defaultValue found for SparkleOptions.${key}`);

	return match[1].trim();
}

describe("sparkles definition", () => {
	test.each(sparklesDefinition.fields.map((f) => [f.key, f] as const))(
		"the playground's default for %s matches the library's @defaultValue",
		(key, field) => {
			expect(toText(fieldCode(field, field.default).tokens)).toBe(
				documentedDefault(key),
			);
		},
	);

	test("an untouched draft generates a call without options", () => {
		const code = toText(
			effectCode(
				sparklesDefinition,
				createEffectDraft(sparklesDefinition),
			),
		);
		expect(code).toBe(
			'import { sparkles } from "party-js";\n\nsparkles(element);',
		);
	});

	test("changed options are listed, with only the imports they need", () => {
		const draft = createEffectDraft(sparklesDefinition);
		draft.count = { form: "fixed", value: 50 };
		draft.startVelocity = { form: "range", min: 800, max: 1400 };
		draft.lifetime = { form: "fixed", value: 0.1 + 0.2 }; // slider noise, rounded to the 0.1 step
		const code = toText(effectCode(sparklesDefinition, draft));
		expect(code).toBe(
			'import { sparkles, range } from "party-js";\n\n' +
				"sparkles(element, {\n\tcount: 50,\n\tstartVelocity: range(800, 1400),\n\tlifetime: 0.3,\n});",
		);

		// the generated code must be valid JavaScript
		expect(
			() => new Function(code.replace(/^import.*\n/, "")),
		).not.toThrow();
	});

	test("the options hold real samplers", () => {
		const options = effectOptions(
			sparklesDefinition,
			createEffectDraft(sparklesDefinition),
		);
		expect(typeof options.count).toBe("function");
	});
});
