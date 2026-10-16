import {
	type Color,
	gradient,
	type ParticleShape,
	randomHue,
	range,
	type Sampler,
} from "party-js";

import { MIXED_COLORS } from "../shared/color";
import { cleanToStep, snapToStep } from "../shared/number";
import { shapeLiteral } from "../shared/shape/code";
import { toParticleShape } from "../shared/shape/draft";
import { fn, plain, string, type Token, toText, value } from "../shared/tokens";
import type {
	ColorsValue,
	Field,
	FieldValue,
	NumericField,
	NumericValue,
	ShapesValue,
} from "./schema";

export function numericOption(
	field: NumericField,
	v: NumericValue,
): Sampler<number> {
	return v.form === "fixed"
		? cleanToStep(v.value, field.step)
		: range(cleanToStep(v.min, field.step), cleanToStep(v.max, field.step));
}

export function colorsOption(v: ColorsValue): string[] | Sampler<Color> {
	switch (v.form) {
		case "palette":
			return [...v.colors];
		case "randomHue":
			return randomHue({ l: v.l, c: v.c });
		case "gradient":
			return gradient([...v.colors]);
	}
}

export function shapesOption(v: ShapesValue): ParticleShape[] {
	return v.map(toParticleShape);
}

export function fieldOption(field: Field, v: FieldValue): unknown {
	switch (field.type) {
		case "numeric":
			return numericOption(field, v as NumericValue);
		case "colors":
			return colorsOption(v as ColorsValue);
		case "shapes":
			return shapesOption(v as ShapesValue);
	}
}

export interface ValueCode {
	tokens: Token[];
	imports: string[];
}

const call = (name: string, args: Token[]): Token[] => [
	fn(name),
	plain("("),
	...args,
	plain(")"),
];
const list = <T>(items: T[], item: (x: T) => Token[]): Token[] =>
	items.flatMap((x, i) => [...(i ? [plain(", ")] : []), ...item(x)]);

function numericCode(field: NumericField, v: NumericValue): ValueCode {
	if (v.form === "fixed")
		return {
			tokens: [value(cleanToStep(v.value, field.step))],
			imports: [],
		};

	return {
		tokens: call("range", [
			value(cleanToStep(v.min, field.step)),
			plain(", "),
			value(cleanToStep(v.max, field.step)),
		]),
		imports: ["range"],
	};
}

function colorsCode(v: ColorsValue): ValueCode {
	const strings = (colors: string[]) => [
		plain("["),
		...list(colors, (c) => [string(c)]),
		plain("]"),
	];
	switch (v.form) {
		case "palette":
			return { tokens: strings(v.colors), imports: [] };
		case "randomHue":
			return {
				tokens: call("randomHue", [
					plain("{ l: "),
					value(v.l),
					plain(", c: "),
					value(v.c),
					plain(" }"),
				]),
				imports: ["randomHue"],
			};
		case "gradient":
			return {
				tokens: call("gradient", strings(v.colors)),
				imports: ["gradient"],
			};
	}
}

function shapesCode(v: ShapesValue): ValueCode {
	return {
		tokens: [plain("["), ...list(v, shapeLiteral), plain("]")],
		imports: [],
	};
}

export function fieldCode(field: Field, v: FieldValue): ValueCode {
	switch (field.type) {
		case "numeric":
			return numericCode(field, v as NumericValue);
		case "colors":
			return colorsCode(v as ColorsValue);
		case "shapes":
			return shapesCode(v as ShapesValue);
	}
}

export function isDefault(field: Field, v: FieldValue): boolean {
	return (
		toText(fieldCode(field, v).tokens) ===
		toText(fieldCode(field, field.default).tokens)
	);
}

export function toRange(field: NumericField, v: NumericValue): NumericValue {
	if (v.form === "range") return v;

	const top = snapToStep(field.max, field);
	const min = snapToStep(Math.min(v.value, top - field.step), field);
	const max = snapToStep(min + (field.max - field.min) / 10, field);

	return {
		form: "range",
		min,
		max: max > min ? max : snapToStep(min + field.step, field),
	};
}

export function toFixed(v: NumericValue): NumericValue {
	return v.form === "fixed" ? v : { form: "fixed", value: v.min };
}

export function toRandomHue(v: ColorsValue): ColorsValue {
	if (v.form === "randomHue") return v;

	return {
		form: "randomHue",
		l: 0.65,
		c: 0.15,
	};
}

export function toPalette(v: ColorsValue): ColorsValue {
	if (v.form === "palette") return v;

	return {
		form: "palette",
		colors: MIXED_COLORS.slice(),
	};
}

export function toGradient(v: ColorsValue): ColorsValue {
	if (v.form === "gradient") return v;

	return {
		form: "gradient",
		colors: MIXED_COLORS.slice(0, 2),
	};
}
