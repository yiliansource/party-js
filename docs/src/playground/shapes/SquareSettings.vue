<script setup lang="ts">
import BarField from "../ui/BarField.vue";

const aspectRatio = defineModel<number>("aspectRatio", { required: true });
const cornerRadius = defineModel<number>("cornerRadius", { required: true });
</script>

<template>
	<div class="flex flex-col gap-2">
		<BarField
			v-model="aspectRatio"
			label="Aspect ratio"
			:min="0.1"
			:max="1"
			:step="0.05"
			:format="v => v.toFixed(2)"
		/>
		<BarField
			v-model="cornerRadius"
			label="Corner radius"
			:min="0"
			:max="0.5"
			:step="0.01"
		/>
	</div>
</template>
