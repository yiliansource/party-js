import type { EffectDefinition } from "../schema";
import { confettiDefinition } from "./confetti";
import { sparklesDefinition } from "./sparkles";

export type AnyEffectDefinition = EffectDefinition<never>;

const defineEffects = <K extends string>(
	effects: Record<K, AnyEffectDefinition>,
) => effects;

export const EFFECTS = defineEffects({
	confetti: confettiDefinition,
	sparkles: sparklesDefinition,
});
export type EffectId = keyof typeof EFFECTS;

export const EFFECT_IDS = Object.keys(EFFECTS) as EffectId[];
