<script setup lang="ts">
import type { ShapeDraft } from "./draft";
import ShapeSettings from "./ShapeSettings.vue";
import ShapeTypePicker from "./ShapeTypePicker.vue";

const { draft } = defineProps<{ draft: ShapeDraft }>();
</script>

<template>
	<div class="flex flex-col gap-4">
		<ShapeTypePicker v-model="draft.type" />
		<ShapeSettings :draft="draft" />
		<slot></slot>
	</div>
</template>
