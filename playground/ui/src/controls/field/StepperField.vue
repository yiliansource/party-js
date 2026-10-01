<script setup lang="ts">
import StepperInput from "../input/StepperInput.vue";
import FieldRow from "./base/FieldRow.vue";

const model = defineModel<number>({ required: true });

defineProps<{
	label: string;
	min: number;
	max: number;
}>();
</script>

<template>
	<FieldRow :label="label">
		<StepperInput v-model="model" :min="min" :max="max" />
	</FieldRow>
</template>
