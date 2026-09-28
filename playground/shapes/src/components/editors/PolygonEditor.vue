<script setup lang="ts">
import { computed, ref } from "vue";

import { polygonPath } from "../../../../../src/shapes/polygon";
import Stepper from "../controls/Stepper.vue";
import ShapeCard from "../ShapeCard.vue";

const sides = ref(5);
const path = computed(() => polygonPath(sides.value));
</script>

<template>
	<ShapeCard name="Polygon" type="polygon" :path="path">
		<Stepper v-model="sides" label="Sides" :min="3" :max="12" />
	</ShapeCard>
</template>
