import { type SparkleOptions, sparkles } from "party-js";

import {
	COLOR_FORMS,
	type EffectDefinition,
	fieldsFor,
	NUMERIC_FORMS,
} from "../schema";

const { numeric, colors } = fieldsFor<SparkleOptions>();

export const sparklesDefinition = {
	id: "sparkles",
	label: "Sparkles",
	description: "Golden sparkles that burst outwards and glint.",
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
			forms: NUMERIC_FORMS,
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
			forms: NUMERIC_FORMS,
			default: { form: "range", min: 250, max: 480 },
		}),
		numeric({
			key: "size",
			label: "Size",
			hint: "The size of the largest sparkles. Most are smaller.",
			group: "look",
			min: 2,
			max: 60,
			step: 1,
			unit: "px",
			forms: NUMERIC_FORMS,
			default: { form: "fixed", value: 24 },
		}),
		numeric({
			key: "lifetime",
			label: "Lifetime",
			group: "motion",
			min: 0.5,
			max: 10,
			step: 0.1,
			unit: "s",
			forms: NUMERIC_FORMS,
			default: { form: "range", min: 0.7, max: 1.4 },
		}),
		colors({
			key: "colors",
			label: "Colors",
			group: "look",
			forms: COLOR_FORMS,
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
