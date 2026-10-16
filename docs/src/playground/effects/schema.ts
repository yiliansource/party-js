import type {
	Color,
	Effect,
	EffectTarget,
	ParticleShape,
	Sampler,
} from "party-js";

import type { ShapeDraft } from "../shared/shape/draft";

/*
 * An effect's playground is described by data, not by components: each effect lists its options as fields, and one
 * generic editor renders any effect from that list. A field's value is plain JSON (a "draft"), so it can be compared,
 * stored in a URL and turned into both real options (to fire the effect) and code (to copy).
 */

export const NUMERIC_FORMS = ["fixed", "range"] as const;
export const COLOR_FORMS = ["randomHue", "palette", "gradient"] as const;

export const FORM_LABELS: Record<
	NumericValue["form"] | ColorsValue["form"],
	string
> = {
	fixed: "Fixed",
	range: "Range",
	randomHue: "Random hue",
	palette: "Palette",
	gradient: "Gradient",
};

export function fieldsFor<O>() {
	type NumericKey = KeysAccepting<O, Sampler<number>>;
	type ColorsKey = KeysAccepting<O, string[] | Sampler<Color>>;
	type ShapesKey = KeysAccepting<O, ParticleShape[]>;

	return {
		numeric: (
			field: Omit<NumericField<NumericKey>, "type">,
		): NumericField<NumericKey> => ({ type: "numeric", ...field }),
		colors: (
			field: Omit<ColorsField<ColorsKey>, "type">,
		): ColorsField<ColorsKey> => ({ type: "colors", ...field }),
		shapes: (
			field: Omit<ShapesField<ShapesKey>, "type">,
		): ShapesField<ShapesKey> => ({ type: "shapes", ...field }),
	};
}

export type NumericValue =
	| { form: "fixed"; value: number }
	| { form: "range"; min: number; max: number };

export type ColorsValue =
	| { form: "palette"; colors: string[] }
	| { form: "randomHue"; l: number; c: number }
	| { form: "gradient"; colors: string[] };

export type ShapesValue = ShapeDraft[];

type Hint<F extends string> = string | Partial<Record<F, string>>;

interface FieldBase<K extends string> {
	key: K;
	label: string;
	group: string;
}

export interface NumericField<K extends string = string> extends FieldBase<K> {
	type: "numeric";
	min: number;
	max: number;
	step: number;
	unit?: string;
	hint?: Hint<NumericValue["form"]>;
	forms: readonly NumericValue["form"][];
	default: NumericValue;
}

export interface ColorsField<K extends string = string> extends FieldBase<K> {
	type: "colors";
	hint?: Hint<ColorsValue["form"]>;
	forms: readonly ColorsValue["form"][];
	default: ColorsValue;
}

export interface ShapesField<K extends string = string> extends FieldBase<K> {
	type: "shapes";
	hint?: string;
	default: ShapesValue;
}

export function hintFor<F extends string>(
	hint: Hint<F> | undefined,
	form: F,
): string | undefined {
	return typeof hint === "string" ? hint : hint?.[form];
}

export type Field<K extends string = string> =
	| NumericField<K>
	| ColorsField<K>
	| ShapesField<K>;
export type FieldValue = Field["default"];

export type KeysAccepting<O, T> = {
	[K in keyof O]-?: T extends NonNullable<O[K]> ? K : never;
}[keyof O] &
	string;

export interface EffectDefinition<O> {
	id: string;
	label: string;
	description?: string;
	call: string;
	groups: readonly { id: string; label: string }[];
	fields: readonly Field<keyof O & string>[];
	fire(target: EffectTarget, options: O): Effect;
}

export type EffectDraft = Record<string, FieldValue>;
