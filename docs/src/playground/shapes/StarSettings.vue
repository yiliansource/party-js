<script setup lang="ts">
import StepperField from "../ui/StepperField.vue";

const points = defineModel<number>("points", { required: true });
</script>

<template>
	<StepperField v-model="points" label="Points" :min="3" :max="16" />
</template>
