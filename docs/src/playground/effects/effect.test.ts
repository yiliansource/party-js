/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import {
	type Color,
	gradient,
	type ParticleShape,
	randomHue,
	range,
	type Sampler,
	type SamplerContext,
} from "party-js";

import { createShapeDraft } from "../shared/shape/draft";
import { type Token, toText } from "../shared/tokens";
import {
	createEffectDraft,
	effectCode,
	effectOptions,
	hasChanges,
} from "./effect";
import {
	COLOR_FORMS,
	type EffectDefinition,
	fieldsFor,
	NUMERIC_FORMS,
	type ShapesValue,
} from "./schema";

/*
 * A small definition that only exists for these tests, so they don't break whenever a real effect's fields or
 * defaults change. It has one field of each kind, and two numeric ones to check that imports are listed once.
 */

interface FixtureOptions {
	count?: Sampler<number>;
	lifetime?: Sampler<number>;
	colors?: string[] | Sampler<Color>;
	shapes?: ParticleShape[];
}

const { numeric, colors, shapes } = fieldsFor<FixtureOptions>();

const DEFAULT_SHAPES: ShapesValue = [
	{
		...createShapeDraft("square"),
		square: { aspectRatio: 1, cornerRadius: 0.2 },
	},
	createShapeDraft("circle"),
];

const fixture = {
	id: "fixture",
	label: "Fixture",
	call: "fixture",
	groups: [{ id: "main", label: "Main" }],
	fields: [
		numeric({
			key: "count",
			label: "Count",
			group: "main",
			min: 1,
			max: 200,
			step: 1,
			forms: NUMERIC_FORMS,
			default: { form: "range", min: 20, max: 40 },
		}),
		numeric({
			key: "lifetime",
			label: "Lifetime",
			group: "main",
			min: 0.1,
			max: 10,
			step: 0.1,
			forms: NUMERIC_FORMS,
			default: { form: "fixed", value: 2 },
		}),
		colors({
			key: "colors",
			label: "Colors",
			group: "main",
			forms: COLOR_FORMS,
			default: { form: "randomHue", l: 0.65, c: 0.15 },
		}),
		shapes({
			key: "shapes",
			label: "Shapes",
			group: "main",
			default: DEFAULT_SHAPES,
		}),
	],
	fire: () => {
		throw new Error("the fixture is never fired");
	},
} satisfies EffectDefinition<FixtureOptions>;

const code = (draft = createEffectDraft(fixture)) =>
	toText(effectCode(fixture, draft));

function sampleAt<T>(sampler: Sampler<T>, random: number): T {
	const ctx: SamplerContext = { rng: () => random, index: 0 };
	return typeof sampler === "function"
		? (sampler as (ctx: SamplerContext) => T)(ctx)
		: sampler;
}

describe("createEffectDraft", () => {
	test("holds every field's default under its key", () => {
		expect(createEffectDraft(fixture)).toEqual({
			count: { form: "range", min: 20, max: 40 },
			lifetime: { form: "fixed", value: 2 },
			colors: { form: "randomHue", l: 0.65, c: 0.15 },
			shapes: DEFAULT_SHAPES,
		});
	});

	test("copies the defaults, so editing a draft never changes the definition", () => {
		const draft = createEffectDraft(fixture);
		(draft.shapes as ShapesValue)[0].square.cornerRadius = 0.5;
		(draft.count as { min: number }).min = 1;

		expect(DEFAULT_SHAPES[0].square.cornerRadius).toBe(0.2);
		expect(fixture.fields[0].default).toEqual({
			form: "range",
			min: 20,
			max: 40,
		});
		expect(createEffectDraft(fixture)).not.toEqual(draft);
	});
});

describe("effectOptions", () => {
	test("includes every field, changed or not", () => {
		const options = effectOptions(fixture, createEffectDraft(fixture));
		expect(Object.keys(options).sort()).toEqual(
			["colors", "count", "lifetime", "shapes"].sort(),
		);
	});

	test("turns values into what the library takes", () => {
		const options = effectOptions(fixture, createEffectDraft(fixture));

		expect(options.lifetime).toBe(2);
		expect(options.count).toBeFunction();
		expect(sampleAt(options.count, 0)).toBe(20);
		expect(sampleAt(options.count, 1)).toBe(40);
		expect(options.colors).toBeFunction();
		expect(options.shapes).toEqual([
			{ type: "square", aspectRatio: 1, cornerRadius: 0.2 },
			{ type: "circle" },
		]);
	});

	test("follows the draft, cleaned to the step", () => {
		const draft = createEffectDraft(fixture);
		draft.lifetime = { form: "fixed", value: 0.1 + 0.2 };
		draft.colors = { form: "palette", colors: ["#ff0000"] };

		const options = effectOptions(fixture, draft);
		expect(options.lifetime).toBe(0.3);
		expect(options.colors).toEqual(["#ff0000"]);
	});
});

describe("hasChanges", () => {
	test("an untouched draft has no changes", () => {
		expect(hasChanges(fixture, createEffectDraft(fixture))).toBe(false);
	});

	test("one changed field is enough, and noise that cleans to the default isn't a change", () => {
		const draft = createEffectDraft(fixture);
		draft.lifetime = { form: "fixed", value: 2.0000001 };
		expect(hasChanges(fixture, draft)).toBe(false);

		draft.count = { form: "fixed", value: 50 };
		expect(hasChanges(fixture, draft)).toBe(true);
	});
});

describe("effectCode", () => {
	test("an untouched draft generates a call without options", () => {
		expect(code()).toBe(
			'import { fixture } from "party-js";\n\nfixture(element);',
		);
	});

	test("changed options are listed in field order, one per line", () => {
		const draft = createEffectDraft(fixture);
		draft.colors = { form: "palette", colors: ["#ff0000"] };
		draft.count = { form: "fixed", value: 50 };

		expect(code(draft)).toBe(
			'import { fixture } from "party-js";\n\n' +
				'fixture(element, {\n\tcount: 50,\n\tcolors: ["#ff0000"],\n});',
		);
	});

	test("only the imports that the listed options use are added", () => {
		// the default count is a range, but a changed fixed count needs no range()
		const draft = createEffectDraft(fixture);
		draft.count = { form: "fixed", value: 50 };
		expect(code(draft)).toStartWith('import { fixture } from "party-js";');
	});

	test("each import is listed once, in order of first use", () => {
		const draft = createEffectDraft(fixture);
		draft.count = { form: "range", min: 10, max: 30 };
		draft.lifetime = { form: "range", min: 1, max: 3 };
		draft.colors = { form: "gradient", colors: ["#fff", "#000"] };

		expect(code(draft)).toStartWith(
			'import { fixture, range, gradient } from "party-js";',
		);
	});

	test("slider noise that cleans to the default is not listed", () => {
		const draft = createEffectDraft(fixture);
		draft.lifetime = { form: "fixed", value: 2.0000001 };
		expect(code(draft)).toEndWith("fixture(element);");
	});

	test("tokens are colored like the docs' code blocks", () => {
		const draft = createEffectDraft(fixture);
		draft.count = { form: "range", min: 10, max: 30 };
		const tokens = effectCode(fixture, draft);
		const kindOf = (text: string) =>
			tokens.find((t: Token) => t.text === text)?.kind;

		expect(kindOf("import")).toBe("keyword");
		expect(kindOf("from")).toBe("keyword");
		expect(kindOf('"party-js"')).toBe("string");
		expect(kindOf("fixture")).toBe("fn");
		expect(kindOf("range")).toBe("fn");
	});

	test("running the code passes the same options the preview fires with", () => {
		const draft = createEffectDraft(fixture);
		draft.count = { form: "range", min: 10, max: 30 };
		draft.lifetime = { form: "fixed", value: 0.1 + 0.2 };
		draft.colors = { form: "randomHue", l: 0.7, c: 0.1 };
		draft.shapes = [
			{ ...createShapeDraft("star"), star: { points: 6 } },
			createShapeDraft("polygon"),
		];

		// run the generated code, with the import replaced by the real samplers and a fixture() that records its call
		let received: FixtureOptions | undefined;
		const run = new Function(
			"fixture",
			"range",
			"randomHue",
			"gradient",
			"element",
			code(draft).replace(/^import .*\n/, ""),
		);
		run(
			(_: unknown, options: FixtureOptions) => {
				received = options;
			},
			range,
			randomHue,
			gradient,
			{},
		);

		const expected = effectOptions(fixture, draft);
		expect(received?.lifetime).toBe(expected.lifetime);
		expect(received?.shapes).toEqual(expected.shapes);
		for (const random of [0, 0.5, 1]) {
			expect(sampleAt(received?.count ?? 0, random)).toBe(
				sampleAt(expected.count ?? 0, random),
			);
			expect(sampleAt(received?.colors ?? [], random)).toEqual(
				sampleAt(expected.colors ?? [], random),
			);
		}
	});
});
