<script setup lang="ts">
import { computed, ref } from "vue";

import SliderField from "@ui/controls/field/SliderField.vue";

import { squarePath } from "@/shapes/square";

import ShapeCard from "../ShapeCard.vue";

const aspectRatio = ref(1);
const cornerRadius = ref(0.2);
const path = computed(() => squarePath(aspectRatio.value, cornerRadius.value));
</script>

<template>
	<ShapeCard name="Square" type="square" :path="path">
		<div class="flex flex-col gap-2">
			<SliderField
				label="Aspect ratio"
				:min="0"
				:max="2"
				:step="0.01"
				v-model="aspectRatio"
			/>
			<SliderField
				label="Corner radius"
				:min="0"
				:max="1"
				:step="0.01"
				v-model="cornerRadius"
			/>
		</div>
	</ShapeCard>
</template>
