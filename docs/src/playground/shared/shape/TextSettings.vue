<script setup lang="ts">
import TextField from "../ui/TextField.vue";

const text = defineModel<string>("text", { required: true });
const font = defineModel<string>("font", { required: true });
</script>

<template>
	<div class="flex flex-col gap-2">
		<TextField v-model="text" label="Text" />
		<TextField v-model="font" label="Font" placeholder="sans-serif" />
	</div>
</template>
