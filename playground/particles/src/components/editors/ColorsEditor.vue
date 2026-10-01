<script setup lang="ts">
import { computed } from "vue";

import Card from "@ui/Card.vue";
import SliderField from "@ui/controls/field/SliderField.vue";
import SegmentedPickerInput from "@ui/controls/input/SegmentedPickerInput.vue";

import type { ColorConfig } from "../../config.ts";
import { useParticlePlaygroundState } from "../../state.ts";
import ColorListField from "../controls/ColorListField.vue";
import EditorCardTitle from "../EditorCardTitle.vue";

const { config } = useParticlePlaygroundState();

const lastByType: Record<ColorConfig["type"], ColorConfig> = {
	pick: {
		type: "pick",
		colors: ["#ff4d6d", "#ffd23f"],
	},
	gradient: {
		type: "gradient",
		colors: ["#ff4d6d", "#ffd23f", "#3ddc97", "#3a86ff"],
	},
	randomHue: {
		type: "randomHue",
		chroma: 0.15,
		luminance: 0.7,
	},
};

const colorType = computed<ColorConfig["type"]>({
	get: () => config.color.type,
	set(type) {
		lastByType[config.color.type] = config.color;
		config.color = lastByType[type];
	},
});
</script>

<template>
	<Card>
		<EditorCardTitle>Color</EditorCardTitle>
		<SegmentedPickerInput
			class="mb-4"
			v-model="colorType"
			:options="[{ 
				value: 'pick',
				label: 'Pick'
			}, { 
				value: 'gradient',
				label: 'Gradient'
			}, { 
				value: 'randomHue',
				label: 'Random Hue'
			}]"
		/>
		<template
			v-if="config.color.type === 'pick' || config.color.type === 'gradient'"
		>
			<ColorListField v-model="config.color.colors" />
		</template>
		<div
			v-if="config.color.type === 'randomHue'"
			class="flex flex-col gap-2"
		>
			<SliderField
				v-model="config.color.luminance"
				label="Luminance"
				:min="0"
				:max="1"
				:step="0.01"
			/>
			<SliderField
				v-model="config.color.chroma"
				label="Chroma"
				:min="0"
				:max="0.5"
				:step="0.01"
			/>
		</div>
	</Card>
</template>
