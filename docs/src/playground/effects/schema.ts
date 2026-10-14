import type { Effect, EffectTarget } from "party-js";

import type { ShapeDraft } from "../shapes/state";

/*
 * An effect's playground is described by data, not by components: each effect lists its options as fields, and one
 * generic editor renders any effect from that list. A field's value is plain JSON (a "draft"), so it can be compared,
 * stored in a URL and turned into both real options (to fire the effect) and code (to copy).
 */

export type NumericValue =
	| { form: "fixed"; value: number }
	| { form: "range"; min: number; max: number };

export type ColorsValue =
	| { form: "palette"; colors: string[] }
	| { form: "randomHue"; l: number; c: number }
	| { form: "gradient"; colors: string[] };

export type ShapesValue = ShapeDraft[];

interface FieldBase<K extends string> {
	key: K;
	label: string;
	hint?: string;
	group: string;
}

export interface NumericField<K extends string = string> extends FieldBase<K> {
	type: "numeric";
	min: number;
	max: number;
	step: number;
	unit?: string;
	forms: readonly NumericValue["form"][];
	default: NumericValue;
}

export interface ColorsField<K extends string = string> extends FieldBase<K> {
	type: "colors";
	forms: readonly ColorsValue["form"][];
	default: ColorsValue;
}

export interface ShapesField<K extends string = string> extends FieldBase<K> {
	type: "shapes";
	default: ShapesValue;
}

export type Field<K extends string = string> =
	| NumericField<K>
	| ColorsField<K>
	| ShapesField<K>;
export type FieldValue = Field["default"];
export type ValueOf<F extends Field> = F["default"];

export type KeysAccepting<O, T> = {
	[K in keyof O]-?: T extends NonNullable<O[K]> ? K : never;
}[keyof O] &
	string;

export interface EffectDefinition<O> {
	id: string;
	label: string;
	call: string;
	groups: readonly { id: string; label: string }[];
	fields: readonly Field<keyof O & string>[];
	fire(target: EffectTarget, options: O): Effect;
}

export type EffectDraft = Record<string, FieldValue>;
