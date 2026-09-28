<script setup lang="ts">
import { computed } from "vue";

import { circlePath } from "../../../../../src/shapes/circle";
import ShapeCard from "../ShapeCard.vue";

const path = computed(() => circlePath());
</script>

<template>
	<ShapeCard name="Circle" type="circle" :path="path">
		<p class="pt-4 pb-2 text-content-secondary text-sm text-center">
			no parameters, always a unit circle
		</p>
	</ShapeCard>
</template>
