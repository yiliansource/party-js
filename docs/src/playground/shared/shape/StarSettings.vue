<script setup lang="ts">
import BarField from "../ui/BarField.vue";
import StepperField from "../ui/StepperField.vue";

const points = defineModel<number>("points", { required: true });
const innerRadius = defineModel<number>("innerRadius", { required: true });
</script>

<template>
	<div class="flex flex-col gap-2">
		<StepperField v-model="points" label="Points" :min="3" :max="16" />
		<BarField
			v-model="innerRadius"
			label="Inner radius"
			:min="0.05"
			:max="1"
			:step="0.01"
			:format="v => v.toFixed(2)"
		/>
	</div>
</template>
