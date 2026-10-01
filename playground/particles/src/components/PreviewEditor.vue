<script setup lang="ts">
import BehaviorsEditor from "./editors/BehaviorsEditor.vue";
import ColorsEditor from "./editors/ColorsEditor.vue";
import ScheduleEditor from "./editors/ScheduleEditor.vue";
import ShapesEditor from "./editors/ShapesEditor.vue";
import SourceEditor from "./editors/SourceEditor.vue";
</script>

<template>
	<div
		class="pb-12 flex flex-col gap-2 w-xl overflow-x-hidden overflow-y-auto editor-panel"
	>
		<ScheduleEditor />
		<SourceEditor />
		<ShapesEditor />
		<ColorsEditor />
		<BehaviorsEditor />
	</div>
</template>

<style scoped>
.editor-panel {
	scrollbar-width: thin;
	scrollbar-color: rgb(0 0 0 / 0.2) transparent;
	scrollbar-gutter: stable;
}
</style>
