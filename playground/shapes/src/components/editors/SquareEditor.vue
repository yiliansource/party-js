<script setup lang="ts">
import { computed, ref } from "vue";

import { squarePath } from "../../../../../src/shapes/square";
import Slider from "../controls/Slider.vue";
import ShapeCard from "../ShapeCard.vue";

const aspectRatio = ref(1);
const cornerRadius = ref(0.2);
const path = computed(() => squarePath(aspectRatio.value, cornerRadius.value));
</script>

<template>
	<ShapeCard name="Square" type="square" :path="path">
		<Slider
			label="Aspect ratio"
			:min="0"
			:max="2"
			:step="0.01"
			v-model="aspectRatio"
		/>
		<Slider
			label="Corner radius"
			:min="0"
			:max="1"
			:step="0.01"
			v-model="cornerRadius"
		/>
	</ShapeCard>
</template>
