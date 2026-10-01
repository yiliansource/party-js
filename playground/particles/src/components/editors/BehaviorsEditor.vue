<script setup lang="ts">
import Card from "@ui/Card.vue";
import SliderField from "@ui/controls/field/SliderField.vue";
import SwitchInput from "@ui/controls/input/SwitchInput.vue";

import { useParticlePlaygroundState } from "../../state.ts";
import EditorCardTitle from "../EditorCardTitle.vue";

const { config } = useParticlePlaygroundState();
</script>

<template>
	<Card>
		<EditorCardTitle>Behaviors</EditorCardTitle>
		<div class="flex flex-col gap-3">
			<div class="flex flex-row gap-3">
				<SwitchInput v-model="config.behaviors.gravity.enabled" />
				<SliderField
					class="grow"
					label="Gravity"
					v-model="config.behaviors.gravity.strength"
					:min="0"
					:max="800"
				/>
			</div>
			<div class="flex flex-row gap-3">
				<SwitchInput v-model="config.behaviors.drag.enabled" />
				<SliderField
					class="grow"
					label="Drag"
					v-model="config.behaviors.drag.terminalVelocity"
					:min="0"
					:max="800"
				/>
			</div>
		</div>
	</Card>
</template>
