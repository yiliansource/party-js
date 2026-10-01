<script setup lang="ts">
import { computed, ref } from "vue";

import StepperField from "@ui/controls/field/StepperField.vue";

import { polygonPath } from "@/shapes/polygon";

import ShapeCard from "../ShapeCard.vue";

const sides = ref(5);
const path = computed(() => polygonPath(sides.value));
</script>

<template>
	<ShapeCard name="Polygon" type="polygon" :path="path">
		<StepperField v-model="sides" label="Sides" :min="3" :max="12" />
	</ShapeCard>
</template>
