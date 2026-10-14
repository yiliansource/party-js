import {
	type Color,
	type ConfettiOptions,
	confetti,
	type ParticleShape,
	type Sampler,
} from "party-js";

import { createDraft as createShapeDraft } from "../../shapes/state";
import type {
	ColorsField,
	EffectDefinition,
	KeysAccepting,
	NumericField,
	ShapesField,
} from "../schema";

type NumericKey = KeysAccepting<ConfettiOptions, Sampler<number>>;
type ColorsKey = KeysAccepting<ConfettiOptions, string[] | Sampler<Color>>;
type ShapesKey = KeysAccepting<ConfettiOptions, ParticleShape[]>;

const numeric = (
	field: Omit<NumericField<NumericKey>, "type">,
): NumericField<NumericKey> => ({ type: "numeric", ...field });
const colors = (
	field: Omit<ColorsField<ColorsKey>, "type">,
): ColorsField<ColorsKey> => ({ type: "colors", ...field });
const shapes = (
	field: Omit<ShapesField<ShapesKey>, "type">,
): ShapesField<ShapesKey> => ({ type: "shapes", ...field });

const BOTH = ["fixed", "range"] as const;

export const confettiDefinition = {
	id: "confetti",
	label: "Confetti",
	call: "confetti",
	groups: [
		{ id: "launch", label: "Launch" },
		{ id: "motion", label: "Motion" },
		{ id: "look", label: "Look" },
	],
	fields: [
		numeric({
			key: "count",
			label: "Count",
			group: "launch",
			min: 1,
			max: 200,
			step: 1,
			forms: BOTH,
			default: { form: "range", min: 20, max: 40 },
		}),
		numeric({
			key: "angle",
			label: "Angle",
			hint: "0° points right, 90° up.",
			group: "launch",
			min: 0,
			max: 360,
			step: 1,
			unit: "°",
			forms: BOTH,
			default: { form: "fixed", value: 90 },
		}),
		numeric({
			key: "spread",
			label: "Spread",
			group: "launch",
			min: 0,
			max: 180,
			step: 1,
			unit: "°",
			forms: BOTH,
			default: { form: "fixed", value: 45 },
		}),
		numeric({
			key: "startVelocity",
			label: "Start velocity",
			group: "launch",
			min: 0,
			max: 2000,
			step: 10,
			unit: "px/s",
			forms: BOTH,
			default: { form: "range", min: 300, max: 600 },
		}),
		numeric({
			key: "gravity",
			label: "Gravity",
			group: "motion",
			min: 0,
			max: 3000,
			step: 10,
			unit: "px/s²",
			forms: ["fixed"],
			default: { form: "fixed", value: 800 },
		}),
		numeric({
			key: "drag",
			label: "Falling speed",
			hint: "The speed at which falling confetti stops speeding up.",
			group: "motion",
			min: 50,
			max: 2000,
			step: 10,
			unit: "px/s",
			forms: ["fixed"],
			default: { form: "fixed", value: 500 },
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
			default: { form: "range", min: 2, max: 4 },
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
			default: { form: "range", min: 6, max: 16 },
		}),
		colors({
			key: "colors",
			label: "Colors",
			group: "look",
			forms: ["randomHue", "palette", "gradient"],
			default: { form: "randomHue", l: 0.65, c: 0.15 },
		}),
		shapes({
			key: "shapes",
			label: "Shapes",
			group: "look",
			default: [
				{
					...createShapeDraft(),
					type: "square",
					square: { aspectRatio: 1, cornerRadius: 0.2 },
				},
				{ ...createShapeDraft(), type: "circle" },
			],
		}),
	],
	fire: (target, options) =>
		confetti(target, {
			...options,
			reducedMotion: "play",
		}),
} satisfies EffectDefinition<ConfettiOptions>;
