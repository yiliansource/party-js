<script setup lang="ts">
import { computed, ref } from "vue";

import { starPath } from "../../../../../src/shapes/star";
import Stepper from "../controls/Stepper.vue";
import ShapeCard from "../ShapeCard.vue";

const points = ref(5);
const path = computed(() => starPath(points.value));
</script>

<template>
	<ShapeCard name="Star" type="star" :path="path">
		<Stepper v-model="points" label="Points" :min="3" :max="12" />
	</ShapeCard>
</template>
