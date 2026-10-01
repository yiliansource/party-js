<script setup lang="ts">
import { computed } from "vue";

import Card from "@ui/Card.vue";
import SliderField from "@ui/controls/field/SliderField.vue";
import SegmentedPickerInput from "@ui/controls/input/SegmentedPickerInput.vue";

import type { EmissionShape } from "@/emitter/shape.ts";

import { useParticlePlaygroundState } from "../../state.ts";
import EditorCardTitle from "../EditorCardTitle.vue";

const state = useParticlePlaygroundState();

const shapeType = computed<EmissionShape["type"]>({
	get: () => state.config.shape.type,
	set: (type) => {
		state.config.shape = buildDefaultShape(type, state.config.shape);
	},
});

function buildDefaultShape(
	type: EmissionShape["type"],
	old: EmissionShape,
): EmissionShape {
	const center = old.center;
	switch (type) {
		case "disk":
			return {
				type: "disk",
				center,
				radius: 50,
			};
		case "rect":
			return {
				type: "rect",
				center,
				width: 100,
				height: 50,
			};
	}
}
</script>

<template>
	<Card>
		<EditorCardTitle>Source</EditorCardTitle>

		<SegmentedPickerInput
			class="mb-4"
			v-model="shapeType"
			:options="[{ value: 'disk', label: 'Disk' }, { value: 'rect', label: 'Rect' }]"
		/>

		<div class="flex flex-col gap-2">
			<template v-if="state.config.shape.type === 'disk'">
				<SliderField
					label="Radius"
					v-model="state.config.shape.radius"
					:min="0"
					:max="300"
				/>
			</template>
			<template v-else-if="state.config.shape.type === 'rect'">
				<SliderField
					label="Width"
					v-model="state.config.shape.width"
					:min="0"
					:max="300"
				/>
				<SliderField
					label="Height"
					v-model="state.config.shape.height"
					:min="0"
					:max="300"
				/>
			</template>
		</div>
	</Card>
</template>
