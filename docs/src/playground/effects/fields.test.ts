/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { type Color, color, type Sampler, type SamplerContext } from "party-js";

import { MIXED_COLORS } from "../shared/color";
import { snapToStep } from "../shared/number";
import { createShapeDraft } from "../shared/shape/draft";
import { toText } from "../shared/tokens";
import {
	colorsOption,
	fieldCode,
	isDefault,
	numericOption,
	shapesOption,
	toFixed,
	toGradient,
	toPalette,
	toRandomHue,
	toRange,
} from "./fields";
import {
	COLOR_FORMS,
	type ColorsField,
	type ColorsValue,
	type Field,
	type FieldValue,
	NUMERIC_FORMS,
	type NumericField,
	type ShapesField,
} from "./schema";

const numeric = (
	field: Pick<NumericField, "min" | "max" | "step" | "default">,
): NumericField => ({
	type: "numeric",
	key: "value",
	label: "Value",
	group: "main",
	forms: NUMERIC_FORMS,
	...field,
});

const count = numeric({
	min: 1,
	max: 200,
	step: 1,
	default: { form: "range", min: 20, max: 40 },
});
const lifetime = numeric({
	min: 0.1,
	max: 10,
	step: 0.1,
	default: { form: "fixed", value: 2 },
});
const size = numeric({
	min: 6,
	max: 40,
	step: 1,
	default: { form: "range", min: 6, max: 16 },
});
const offGrid = numeric({
	min: 0,
	max: 10,
	step: 4,
	default: { form: "fixed", value: 0 },
});

const colors: ColorsField = {
	type: "colors",
	key: "colors",
	label: "Colors",
	group: "main",
	forms: COLOR_FORMS,
	default: { form: "randomHue", l: 0.65, c: 0.15 },
};

const shapes: ShapesField = {
	type: "shapes",
	key: "shapes",
	label: "Shapes",
	group: "main",
	default: [
		{
			...createShapeDraft("square"),
			square: { aspectRatio: 1, cornerRadius: 0.2 },
		},
		createShapeDraft("circle"),
	],
};

function sampleAt<T>(sampler: Sampler<T>, random: number): T {
	const ctx: SamplerContext = { rng: () => random, index: 0 };
	return typeof sampler === "function"
		? (sampler as (ctx: SamplerContext) => T)(ctx)
		: sampler;
}

const about = ({ l, a, b, alpha }: Color) => ({
	l: expect.closeTo(l),
	a: expect.closeTo(a),
	b: expect.closeTo(b),
	alpha: expect.closeTo(alpha),
});

describe("numericOption", () => {
	test("a fixed value is a plain number, cleaned to the step", () => {
		expect(
			numericOption(lifetime, { form: "fixed", value: 0.1 + 0.2 }),
		).toBe(0.3);
	});

	test("a range is a sampler between its cleaned bounds", () => {
		const option = numericOption(lifetime, {
			form: "range",
			min: 0.1 + 0.2,
			max: 1,
		});
		expect(option).toBeFunction();
		expect(sampleAt(option, 0)).toBe(0.3);
		expect(sampleAt(option, 1)).toBe(1);
	});
});

describe("colorsOption", () => {
	test("a palette is a copy, so the library never holds on to the draft's array", () => {
		const value = {
			form: "palette" as const,
			colors: ["#ff0000", "#0000ff"],
		};
		const option = colorsOption(value);
		expect(option).toEqual(value.colors);
		expect(option).not.toBe(value.colors);
	});

	test("a random hue keeps its lightness and chroma", () => {
		const option = colorsOption({ form: "randomHue", l: 0.65, c: 0.15 });
		for (const random of [0, 0.3, 0.7]) {
			const { l, a, b } = sampleAt(option as Sampler<Color>, random);
			expect(l).toBeCloseTo(0.65);
			expect(Math.hypot(a, b)).toBeCloseTo(0.15);
		}
	});

	test("a gradient runs from its first to its last color", () => {
		const option = colorsOption({
			form: "gradient",
			colors: ["#ff0000", "#00ff00", "#0000ff"],
		});
		expect(sampleAt(option, 0)).toEqual(about(color("#ff0000")));
		expect(sampleAt(option, 1)).toEqual(about(color("#0000ff")));
	});
});

describe("shapesOption", () => {
	test("each draft becomes a shape with only its own type's settings", () => {
		expect(
			shapesOption([
				{ ...createShapeDraft("star"), star: { points: 6 } },
				createShapeDraft("circle"),
			]),
		).toEqual([{ type: "star", points: 6 }, { type: "circle" }]);
	});
});

describe("fieldCode", () => {
	const code = (...args: Parameters<typeof fieldCode>) => {
		const { tokens, imports } = fieldCode(...args);
		return { text: toText(tokens), imports };
	};

	test("a fixed number is written as is", () => {
		expect(code(count, { form: "fixed", value: 50 })).toEqual({
			text: "50",
			imports: [],
		});
	});

	test("a range is written as a range() call", () => {
		expect(code(count, { form: "range", min: 20, max: 40 })).toEqual({
			text: "range(20, 40)",
			imports: ["range"],
		});
	});

	test("slider noise is cleaned to the step", () => {
		expect(code(lifetime, { form: "fixed", value: 0.1 + 0.2 }).text).toBe(
			"0.3",
		);
		expect(
			code(lifetime, { form: "range", min: 0.1 + 0.2, max: 0.7 + 0.1 })
				.text,
		).toBe("range(0.3, 0.8)");
	});

	test("a palette is written as an array of strings", () => {
		expect(
			code(colors, { form: "palette", colors: ["#ff0000", "#0000ff"] }),
		).toEqual({ text: '["#ff0000", "#0000ff"]', imports: [] });
	});

	test("a random hue is written as a randomHue() call", () => {
		expect(code(colors, { form: "randomHue", l: 0.65, c: 0.15 })).toEqual({
			text: "randomHue({ l: 0.65, c: 0.15 })",
			imports: ["randomHue"],
		});
	});

	test("a gradient is written as a gradient() call", () => {
		expect(
			code(colors, { form: "gradient", colors: ["#ff0000", "#0000ff"] }),
		).toEqual({
			text: 'gradient(["#ff0000", "#0000ff"])',
			imports: ["gradient"],
		});
	});

	test("shapes are written as an array of shape literals", () => {
		expect(code(shapes, shapes.default)).toEqual({
			text: '[{ type: "square", cornerRadius: 0.2 }, { type: "circle" }]',
			imports: [],
		});
	});

	test.each<[string, Field, FieldValue]>([
		["a fixed number", count, { form: "fixed", value: 50 }],
		["a range", count, { form: "range", min: 20, max: 40 }],
		["a palette", colors, { form: "palette", colors: ['#fff"', "#000"] }],
		["a random hue", colors, { form: "randomHue", l: 0.65, c: 0.15 }],
		["a gradient", colors, { form: "gradient", colors: ["#fff", "#000"] }],
		[
			"shapes",
			shapes,
			[
				createShapeDraft("polygon"),
				{ ...createShapeDraft("path"), path: { d: 'M0 0 "x"' } },
			],
		],
	])("%s is a valid JavaScript expression", (_, field, value) => {
		const { text } = code(field, value);
		expect(() => new Function(`return (${text});`)).not.toThrow();
	});
});

describe("isDefault", () => {
	test("the default, or a copy of it, is default", () => {
		expect(isDefault(count, count.default)).toBe(true);
		expect(isDefault(shapes, structuredClone(shapes.default))).toBe(true);
	});

	test("a changed value is not default", () => {
		expect(isDefault(count, { form: "range", min: 20, max: 41 })).toBe(
			false,
		);
		expect(isDefault(count, { form: "fixed", value: 20 })).toBe(false);
		expect(isDefault(colors, { form: "randomHue", l: 0.7, c: 0.15 })).toBe(
			false,
		);
	});

	test("slider noise that cleans to the default is default", () => {
		expect(isDefault(lifetime, { form: "fixed", value: 2.0000001 })).toBe(
			true,
		);
	});

	test("the settings of shape types that aren't selected don't count", () => {
		const [square, circle] = structuredClone(shapes.default);
		circle.square = { aspectRatio: 0.5, cornerRadius: 0.4 };
		expect(isDefault(shapes, [square, circle])).toBe(true);
	});
});

describe("switching numeric forms", () => {
	describe("toRange", () => {
		test("a range is returned unchanged", () => {
			const value = { form: "range" as const, min: 20, max: 40 };
			expect(toRange(count, value)).toBe(value);
		});

		test("a fixed value becomes a range starting there, a tenth of the field wide", () => {
			expect(toRange(count, { form: "fixed", value: 50 })).toEqual({
				form: "range",
				min: 50,
				max: 70,
			});
			expect(toRange(lifetime, { form: "fixed", value: 2 })).toEqual({
				form: "range",
				min: 2,
				max: 3,
			});
		});

		test("the width is measured from the field's minimum, not from 0", () => {
			// 6 to 40 is 34 wide, so a tenth is 3.4 and snaps to 3.
			expect(toRange(size, { form: "fixed", value: 10 })).toEqual({
				form: "range",
				min: 10,
				max: 13,
			});
		});

		test("the range stops at the field's maximum", () => {
			expect(toRange(count, { form: "fixed", value: 190 })).toEqual({
				form: "range",
				min: 190,
				max: 200,
			});
		});

		test("a value at the maximum moves down a step, so the range has room", () => {
			expect(toRange(count, { form: "fixed", value: 200 })).toEqual({
				form: "range",
				min: 199,
				max: 200,
			});
		});

		test("the range is at least one step wide", () => {
			// a tenth of 3 is 0.3, which would snap back onto the minimum.
			const small = numeric({
				min: 0,
				max: 3,
				step: 1,
				default: { form: "fixed", value: 1 },
			});
			expect(toRange(small, { form: "fixed", value: 1 })).toEqual({
				form: "range",
				min: 1,
				max: 2,
			});
		});

		test("a maximum that isn't on the step grid counts as the highest reachable value", () => {
			// the range has to end at 8, so it starts one step below that.
			expect(toRange(offGrid, { form: "fixed", value: 10 })).toEqual({
				form: "range",
				min: 4,
				max: 8,
			});
		});

		test.each([
			["count", count],
			["lifetime", lifetime],
			["size", size],
			["off-grid", offGrid],
		] as const)("every %s value gives a valid range", (_, field) => {
			for (let v = field.min; v <= field.max; v += field.step) {
				const range = toRange(field, { form: "fixed", value: v });
				if (range.form !== "range") throw new Error("expected a range");

				expect(range.min).toBeLessThan(range.max);
				for (const bound of [range.min, range.max])
					expect(snapToStep(bound, field)).toBe(bound);
			}
		});

		test("the fixed value isn't modified", () => {
			const value = { form: "fixed" as const, value: 50 };
			toRange(count, value);
			expect(value).toEqual({ form: "fixed", value: 50 });
		});
	});

	describe("toFixed", () => {
		test("a range keeps its minimum", () => {
			expect(toFixed({ form: "range", min: 20, max: 40 })).toEqual({
				form: "fixed",
				value: 20,
			});
		});

		test("a fixed value is returned unchanged", () => {
			const value = { form: "fixed" as const, value: 50 };
			expect(toFixed(value)).toBe(value);
		});

		test("the range isn't modified", () => {
			const value = { form: "range" as const, min: 20, max: 40 };
			toFixed(value);
			expect(value).toEqual({ form: "range", min: 20, max: 40 });
		});
	});
});

describe("switching color forms", () => {
	// one value per form, with colors that differ from MIXED_COLORS so a result can't pass by accident
	const values: Record<ColorsValue["form"], ColorsValue> = {
		randomHue: { form: "randomHue", l: 0.7, c: 0.1 },
		palette: { form: "palette", colors: ["#111111", "#222222", "#333333"] },
		gradient: { form: "gradient", colors: ["#aaaaaa", "#bbbbbb"] },
	};

	const conversions = [
		["toRandomHue", toRandomHue, "randomHue"],
		["toPalette", toPalette, "palette"],
		["toGradient", toGradient, "gradient"],
	] as const;

	describe.each(conversions)("%s", (_, convert, target) => {
		test("a value already in this form is returned unchanged", () => {
			const value = values[target];
			expect(convert(value)).toBe(value);
		});

		const others = COLOR_FORMS.filter((form) => form !== target);
		test.each(others)(
			"a %s value is switched, and left untouched",
			(form) => {
				const value = values[form];
				const before = structuredClone(value);

				expect(convert(value).form).toBe(target);
				expect(value).toEqual(before);
			},
		);
	});

	test("random hue starts at the default lightness and chroma", () => {
		expect(toRandomHue(values.palette)).toEqual({
			form: "randomHue",
			l: 0.65,
			c: 0.15,
		});
	});

	test("a palette starts with the mixed colors", () => {
		expect(toPalette(values.randomHue)).toEqual({
			form: "palette",
			colors: MIXED_COLORS,
		});
	});

	test("a gradient starts with exactly two colors, since the editor shows a start and an end", () => {
		expect(toGradient(values.randomHue)).toEqual({
			form: "gradient",
			colors: MIXED_COLORS.slice(0, 2),
		});
	});

	test.each([
		["toPalette", toPalette],
		["toGradient", toGradient],
	] as const)(
		"%s never hands out the shared MIXED_COLORS array",
		(_, convert) => {
			// the palette editor pushes and splices the draft's array in place, which must not change the constant
			const before = [...MIXED_COLORS];
			const result = convert(values.randomHue);
			if (result.form === "randomHue") throw new Error("expected colors");

			expect(result.colors).not.toBe(MIXED_COLORS);
			result.colors.push("#000000");
			result.colors[0] = "#ffffff";
			expect(MIXED_COLORS).toEqual(before);
			expect(convert(values.randomHue)).not.toBe(result);
		},
	);

	test("every switched value generates valid code", () => {
		for (const [, convert] of conversions)
			for (const form of COLOR_FORMS) {
				const { tokens } = fieldCode(colors, convert(values[form]));
				expect(
					() => new Function(`return (${toText(tokens)});`),
				).not.toThrow();
			}
	});
});
