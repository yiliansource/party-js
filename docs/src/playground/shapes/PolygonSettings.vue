<script setup lang="ts">
import StepperField from "../ui/StepperField.vue";

const sides = defineModel<number>("sides", { required: true });
</script>

<template>
	<StepperField v-model="sides" label="Sides" :min="3" :max="16" />
</template>
