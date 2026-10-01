<script setup lang="ts">
import SliderInput from "../input/SliderInput.vue";
import FieldStack from "./base/FieldStack.vue";

const model = defineModel<number>({ required: true });

defineProps<{
	label: string;
	min: number;
	max: number;
	step?: number;
	format?: (value: number) => string;
}>();
</script>

<template>
	<FieldStack :label="label" class="mb-2">
		<template v-slot:value>
			<span class="font-mono text-xs text-content-primary">{{
				format ? format(model) : model
			}}</span>
		</template>
		<SliderInput
			v-model="model"
			:min="min"
			:max="max"
			:step="step"
			:format="format"
		/>
	</FieldStack>
</template>
