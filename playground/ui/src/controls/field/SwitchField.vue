<script setup lang="ts">
import SwitchInput from "../input/SwitchInput.vue";
import FieldRow from "./base/FieldRow.vue";

const model = defineModel<boolean>({ required: true });

defineProps<{
	label: string;
}>();
</script>

<template>
	<FieldRow :label="label">
		<SwitchInput v-model="model" />
	</FieldRow>
</template>
