<script setup lang="ts">
import CodeConsole from "./components/CodeConsole.vue";
import CodeEditor from "./components/CodeEditor.vue";
import CodePreviewStage from "./components/CodePreviewStage.vue";
</script>

<template>
	<div
		class="relative grid grid-cols-[minmax(0,1fr)_600px] gap-y-4 gap-x-6 touch-manipulation"
	>
		<CodeEditor />
		<div class="flex flex-col gap-4">
			<CodePreviewStage />
			<CodeConsole />
		</div>
	</div>
</template>
