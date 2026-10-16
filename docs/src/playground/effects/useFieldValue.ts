import { computed, type MaybeRefOrGetter, toValue } from "vue";

import type { EffectDraft, Field } from "./schema";

export function useFieldValue<F extends Field>(
	draft: MaybeRefOrGetter<EffectDraft>,
	field: MaybeRefOrGetter<F>,
) {
	return computed<F["default"]>({
		get: () => toValue(draft)[toValue(field).key] as F["default"],
		set: (v) => {
			toValue(draft)[toValue(field).key] = v;
		},
	});
}
