<script setup lang="ts">
import { computed } from "vue";

import GradientField from "../../shared/ui/GradientInput.vue";
import PaletteField from "../../shared/ui/PaletteInput.vue";
import PanelText from "../../shared/ui/PanelText.vue";
import RandomHueField from "../../shared/ui/RandomHueField.vue";
import SegmentedControl from "../../shared/ui/SegmentedControl.vue";
import { isDefault, toGradient, toPalette, toRandomHue } from "../fields";
import {
	type ColorsField,
	type ColorsValue,
	type EffectDraft,
	FORM_LABELS,
	hintFor,
} from "../schema";
import { useFieldValue } from "../useFieldValue";
import FieldHeader from "./FieldHeader.vue";

const { field, draft } = defineProps<{
	field: ColorsField;
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
function setForm(form: ColorsValue["form"]) {
	if (form === "randomHue") value.value = toRandomHue(value.value);
	else if (form === "palette") value.value = toPalette(value.value);
	else if (form === "gradient") value.value = toGradient(value.value);
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
				class="shrink-0"
			/>
		</FieldHeader>
		<RandomHueField
			v-if="value.form === 'randomHue'"
			v-model:l="value.l"
			v-model:c="value.c"
		/>
		<PaletteField v-else-if="value.form === 'palette'" v-model="value" />
		<GradientField v-else-if="value.form === 'gradient'" v-model="value" />
		<PanelText v-if="hint">{{ hint }}</PanelText>
	</div>
</template>
