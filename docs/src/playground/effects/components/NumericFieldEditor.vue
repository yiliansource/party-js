<script setup lang="ts">
import { computed } from "vue";

import BarField from "../../shared/ui/BarField.vue";
import PanelText from "../../shared/ui/PanelText.vue";
import RangeBarField from "../../shared/ui/RangeBarField.vue";
import SegmentedControl from "../../shared/ui/SegmentedControl.vue";
import { isDefault, toFixed, toRange } from "../fields";
import {
	type EffectDraft,
	FORM_LABELS,
	hintFor,
	type NumericField,
	type NumericValue,
} from "../schema";
import { useFieldValue } from "../useFieldValue";
import FieldHeader from "./FieldHeader.vue";

const { field, draft } = defineProps<{
	field: NumericField;
	draft: EffectDraft;
}>();

const value = useFieldValue(
	() => draft,
	() => field,
);
const changed = computed(() => !isDefault(field, value.value));

function reset() {
	value.value = structuredClone(field.default);
}
function setForm(form: NumericValue["form"]) {
	if (form === "range") value.value = toRange(field, value.value);
	else if (form === "fixed") value.value = toFixed(value.value);
}

const formOptions = computed(() =>
	field.forms.map((form) => ({ value: form, label: FORM_LABELS[form] })),
);

const hint = computed(() => hintFor(field.hint, value.value.form));
</script>

<template>
	<div class="flex flex-col gap-2">
		<FieldHeader :label="field.label" :changed @reset="reset">
			<SegmentedControl
				v-if="field.forms.length > 1"
				size="sm"
				:label="`${field.label} form`"
				:model-value="value.form"
				:options="formOptions"
				@update:model-value="setForm"
			/>
		</FieldHeader>
		<BarField
			v-if="value.form === 'fixed'"
			v-model="value.value"
			:label="field.label"
			hide-label
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:unit="field.unit"
		/>
		<RangeBarField
			v-else-if="value.form === 'range'"
			v-model:lo="value.min"
			v-model:hi="value.max"
			:label="field.label"
			hide-label
			:min="field.min"
			:max="field.max"
			:step="field.step"
			:unit="field.unit"
		/>
		<PanelText v-if="hint">{{ hint }}</PanelText>
	</div>
</template>
