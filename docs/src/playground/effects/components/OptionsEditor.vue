<script setup lang="ts">
import { computed } from "vue";

import Panel from "../../shared/ui/Panel.vue";
import type { AnyEffectDefinition } from "../definitions/index";
import type { EffectDraft } from "../schema";
import ColorsFieldEditor from "./ColorsFieldEditor.vue";
import NumericFieldEditor from "./NumericFieldEditor.vue";
import ShapesFieldEditor from "./ShapesFieldEditor.vue";

const { definition, draft } = defineProps<{
	definition: AnyEffectDefinition;
	draft: EffectDraft;
}>();

const groups = computed(() =>
	definition.groups.map((group) => ({
		...group,
		fields: definition.fields.filter((f) => f.group === group.id),
	})),
);
</script>

<template>
	<Panel v-for="group in groups" :key="group.id" :title="group.label">
		<template v-for="field in group.fields" :key="field.key">
			<NumericFieldEditor v-if="field.type === 'numeric'" :field :draft />
			<ColorsFieldEditor
				v-else-if="field.type === 'colors'"
				:field
				:draft
			/>
			<ShapesFieldEditor v-else :field :draft />
		</template>
	</Panel>
</template>
