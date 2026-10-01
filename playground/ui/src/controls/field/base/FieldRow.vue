<script setup lang="ts">
import FieldLabel from "./FieldLabel.vue";

defineProps<{
	label: string;
}>();
</script>

<template>
	<div class="flex flex-row justify-between items-center">
		<FieldLabel>{{ label }}</FieldLabel>
		<slot></slot>
	</div>
</template>
