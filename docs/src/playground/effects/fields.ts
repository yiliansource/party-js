import {
	type Color,
	gradient,
	type ParticleShape,
	randomHue,
	range,
	type Sampler,
} from "party-js";

import { fn, plain, string, type Token, toText, value } from "../code";
import { shapeLiteral } from "../shapes/code";
import { toShape } from "../shapes/state";
import type {
	ColorsValue,
	Field,
	FieldValue,
	NumericField,
	NumericValue,
	ShapesValue,
} from "./schema";

function round(n: number, step: number): number {
	const decimals = (String(step).split(".")[1] ?? "").length;
	return Number(n.toFixed(decimals));
}

export function numericOption(
	field: NumericField,
	v: NumericValue,
): Sampler<number> {
	return v.form === "fixed"
		? round(v.value, field.step)
		: range(round(v.min, field.step), round(v.max, field.step));
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
	return v.map(toShape);
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
		return { tokens: [value(round(v.value, field.step))], imports: [] };

	return {
		tokens: call("range", [
			value(round(v.min, field.step)),
			plain(", "),
			value(round(v.max, field.step)),
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
	const gap = Math.max(
		field.step,
		round((field.max - field.min) / 10, field.step),
	);
	const min = Math.min(v.value, field.max - field.step);
	return {
		form: "range",
		min,
		max: Math.min(field.max, round(min + gap, field.step)),
	};
}

export function toFixed(v: NumericValue): NumericValue {
	return v.form === "fixed" ? v : { form: "fixed", value: v.min };
}
