import { prefersReducedMotion } from "../shared/preference";
import { EFFECTS, type EffectId } from "./definitions";
import { createEffectDraft } from "./effect";
import type { EffectDraft } from "./schema";

export interface EffectsState {
	effect: EffectId;
	drafts: Record<EffectId, EffectDraft>;
	// background: Background;
	repeat: boolean;
}

export const createEffectsState = (): EffectsState => ({
	effect: "confetti",
	drafts: Object.fromEntries(
		(Object.keys(EFFECTS) as EffectId[]).map((id) => [
			id,
			createEffectDraft(EFFECTS[id]),
		]),
	) as Record<EffectId, EffectDraft>,
	// background: "page",
	repeat: !prefersReducedMotion(),
});
