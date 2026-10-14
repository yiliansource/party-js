import {
	type Color,
	type Sampler,
	type SparkleOptions,
	sparkles,
} from "party-js";

import type {
	ColorsField,
	EffectDefinition,
	KeysAccepting,
	NumericField,
} from "../schema";

type NumericKey = KeysAccepting<SparkleOptions, Sampler<number>>;
type ColorsKey = KeysAccepting<SparkleOptions, string[] | Sampler<Color>>;

const numeric = (
	field: Omit<NumericField<NumericKey>, "type">,
): NumericField<NumericKey> => ({ type: "numeric", ...field });
const colors = (
	field: Omit<ColorsField<ColorsKey>, "type">,
): ColorsField<ColorsKey> => ({ type: "colors", ...field });

const BOTH = ["fixed", "range"] as const;

export const sparklesDefinition = {
	id: "sparkles",
	label: "Sparkles",
	call: "sparkles",
	groups: [
		{ id: "burst", label: "Burst" },
		{ id: "motion", label: "Motion" },
		{ id: "look", label: "Look" },
	],
	fields: [
		numeric({
			key: "count",
			label: "Count",
			group: "burst",
			min: 1,
			max: 200,
			step: 1,
			forms: BOTH,
			default: { form: "range", min: 20, max: 40 },
		}),
		numeric({
			key: "startVelocity",
			label: "Start velocity",
			group: "burst",
			min: 0,
			max: 2000,
			step: 10,
			unit: "px/s",
			forms: BOTH,
			default: { form: "range", min: 150, max: 250 },
		}),
		numeric({
			key: "size",
			label: "Size",
			group: "look",
			min: 2,
			max: 40,
			step: 1,
			unit: "px",
			forms: BOTH,
			default: { form: "range", min: 16, max: 22 },
		}),
		numeric({
			key: "lifetime",
			label: "Lifetime",
			group: "motion",
			min: 0.5,
			max: 10,
			step: 0.1,
			unit: "s",
			forms: BOTH,
			default: { form: "range", min: 0.5, max: 1 },
		}),
		colors({
			key: "colors",
			label: "Colors",
			group: "look",
			forms: ["randomHue", "palette", "gradient"],
			default: {
				form: "gradient",
				colors: ["oklch(0.7 0.15 70)", "oklch(0.95 0.15 70)"],
			},
		}),
	],
	fire: (target, options) =>
		sparkles(target, {
			...options,
			reducedMotion: "play",
		}),
} satisfies EffectDefinition<SparkleOptions>;
