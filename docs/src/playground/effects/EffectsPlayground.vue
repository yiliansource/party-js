<script setup lang="ts">
import { RotateCcwIcon } from "@lucide/vue";
import { computed, reactive } from "vue";

import CodeBlock from "../shared/ui/CodeBlock.vue";
import Panel from "../shared/ui/Panel.vue";
import PanelText from "../shared/ui/PanelText.vue";
import SegmentedControl from "../shared/ui/SegmentedControl.vue";
import EffectPreviewStage from "./components/EffectPreviewStage.vue";
import OptionsEditor from "./components/OptionsEditor.vue";
import { EFFECTS, type EffectId } from "./definitions";
import { createEffectDraft, effectCode, hasChanges } from "./effect";
import { createEffectsState } from "./state";

const state = reactive(createEffectsState());
const definition = computed(() => EFFECTS[state.effect]);
const draft = computed(() => state.drafts[state.effect]);
const tokens = computed(() => effectCode(definition.value, draft.value));

function resetAll() {
	state.drafts[state.effect] = createEffectDraft(definition.value);
}

const changed = computed(() => hasChanges(definition.value, draft.value));
</script>

<template>
	<div
		class="relative grid grid-cols-1 md:grid-cols-[400px_minmax(0,1fr)] gap-y-4 gap-x-6 touch-manipulation"
	>
		<div class="flex flex-col gap-4">
			<Panel title="Effect">
				<div class="flex flex-col gap-2">
					<SegmentedControl
						size="sm"
						:model-value="state.effect"
						:options="Object.values(EFFECTS).map(e => ({ value: e.id as EffectId, label: e.label }))"
						@update:model-value="(v) => state.effect = v"
					/>
					<PanelText v-if="definition.description">
						{{ definition.description }}
					</PanelText>
				</div>
			</Panel>
			<OptionsEditor :definition :draft />
		</div>
		<div
			class="contents md:flex md:flex-col md:gap-4 md:sticky md:top-24 md:self-start"
		>
			<EffectPreviewStage
				:definition
				:draft
				v-model:repeat="state.repeat"
				class="order-first md:order-0"
			/>
			<CodeBlock file="effect.js" :tokens="tokens">
				<template #actions>
					<button
						type="button"
						:disabled="!changed"
						class="px-3 py-1.5 flex flex-row items-center gap-2 bg-transparent rounded-xl text-inherit cursor-pointer
							disabled:cursor-not-allowed disabled:opacity-50 not-disabled:hover:bg-code-line"
						@click="resetAll"
					>
						<RotateCcwIcon :size="16" />
						<span class="text-sm font-semibold">Reset all</span>
					</button>
				</template>
			</CodeBlock>
		</div>
	</div>
</template>
