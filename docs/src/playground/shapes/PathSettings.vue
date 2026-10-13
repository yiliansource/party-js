<script setup lang="ts">
import PanelText from "../ui/PanelText.vue";
import TextareaField from "../ui/TextareaField.vue";

const d = defineModel<string>("d", { required: true });
</script>

<template>
	<div class="flex flex-col gap-2">
		<TextareaField v-model="d" label="SVG path" />
		<PanelText>
			In shape units: the shape fills the box from <code>-0.5</code> to
			<code>0.5</code>, with y pointing down.
		</PanelText>
	</div>
</template>
