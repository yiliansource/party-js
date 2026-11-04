import { prefersReducedMotion } from "../shared/preference";
import type { PreviewBackground } from "../shared/preview";
import { EFFECT_IDS, EFFECTS, type EffectId } from "./definitions";
import { createEffectDraft } from "./effect";
import type { EffectDraft } from "./schema";

const isEffectId = (value: string | null): value is EffectId =>
	value !== null && (EFFECT_IDS as readonly string[]).includes(value);

export function effectFromUrl(): EffectId {
	const id = new URLSearchParams(location.search).get("effect");
	return isEffectId(id) ? id : "confetti";
}

export interface EffectsState {
	effect: EffectId;
	drafts: Record<EffectId, EffectDraft>;
	background: PreviewBackground;
	repeat: boolean;
}

export const createEffectsState = (
	effect: EffectId = "confetti",
): EffectsState => ({
	effect,
	drafts: Object.fromEntries(
		(Object.keys(EFFECTS) as EffectId[]).map((id) => [
			id,
			createEffectDraft(EFFECTS[id]),
		]),
	) as Record<EffectId, EffectDraft>,
	background: "page",
	repeat: !prefersReducedMotion(),
});
