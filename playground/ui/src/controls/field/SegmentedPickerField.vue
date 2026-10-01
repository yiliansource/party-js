<script setup lang="ts">
import type { Option } from "../input/SegmentedPickerInput.vue";
import SegmentedPickerInput from "../input/SegmentedPickerInput.vue";
import FieldStack from "./base/FieldStack.vue";

const model = defineModel<string>({ required: true });

defineProps<{
	label: string;
	options: string[] | Option[];
}>();
</script>

<template>
	<FieldStack :label="label" class="mb-2">
		<SegmentedPickerInput v-model="model" :options="options" />
	</FieldStack>
</template>
