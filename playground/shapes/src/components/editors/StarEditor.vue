<script setup lang="ts">
import { computed, ref } from "vue";

import StepperField from "@ui/controls/field/StepperField.vue";

import { starPath } from "@/shapes/star";

import ShapeCard from "../ShapeCard.vue";

const points = ref(5);
const path = computed(() => starPath(points.value));
</script>

<template>
	<ShapeCard name="Star" type="star" :path="path">
		<StepperField v-model="points" label="Points" :min="3" :max="12" />
	</ShapeCard>
</template>
