<script setup lang="ts">
import type { ShapeDraft } from "./draft";
import ShapeSettings from "./ShapeSettings.vue";
import ShapeTypePicker from "./ShapeTypePicker.vue";

const { draft } = defineProps<{ draft: ShapeDraft }>();
</script>

<template>
	<ShapeTypePicker v-model="draft.type" />
	<ShapeSettings :draft="draft" />
</template>
