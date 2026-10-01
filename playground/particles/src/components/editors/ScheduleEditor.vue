<script setup lang="ts">
import { computed } from "vue";

import Card from "@ui/Card.vue";
import SliderField from "@ui/controls/field/SliderField.vue";
import SwitchField from "@ui/controls/field/SwitchField.vue";

import { useParticlePlaygroundState } from "../../state";
import BurstField from "../controls/BurstField.vue";
import EditorCardTitle from "../EditorCardTitle.vue";

const { config } = useParticlePlaygroundState();

const loopForever = computed<boolean>({
	get: () => !Number.isFinite(config.schedule.loops),
	set: (v) => (config.schedule.loops = v ? Number.POSITIVE_INFINITY : 1),
});
</script>

<template>
	<Card>
		<EditorCardTitle>Schedule</EditorCardTitle>
		<div class="flex flex-col gap-4">
			<SliderField
				v-model="config.schedule.duration"
				label="Duration"
				:min="0.1"
				:max="20"
				:step="0.1"
				:format="(v) => `${v}s`"
			/>
			<SwitchField v-model="loopForever" label="Loop Forever" />
			<SliderField
				v-model="config.schedule.rate"
				label="Rate"
				:min="0"
				:max="100"
				:step="1"
				:format="(v) => `${v}/s`"
			/>
			<BurstField v-model="config.schedule.bursts" />
		</div>
	</Card>
</template>
