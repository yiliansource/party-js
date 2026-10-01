<script setup lang="ts">
import FieldRow from "./FieldRow.vue";

defineProps<{
	label: string;
}>();
</script>

<template>
	<div class="flex flex-col gap-2">
		<FieldRow :label="label">
			<slot name="value"></slot>
		</FieldRow>
		<slot></slot>
	</div>
</template>
