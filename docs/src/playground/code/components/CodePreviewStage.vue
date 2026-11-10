<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";

import type { PreviewBackground } from "../../shared/preview.ts";
import PreviewStage from "../../shared/ui/PreviewStage.vue";
import type { CodeSandbox } from "../sandbox/sandbox";
import DemoButton from "./DemoButton.vue";

const { sandbox } = defineProps<{
	sandbox: CodeSandbox;
}>();

const background = ref<PreviewBackground>("dark");
const host = useTemplateRef<HTMLDivElement>("host");

onMounted(() => sandbox.mount(host.value!));
onBeforeUnmount(() => sandbox.unmount());

function handleClick(event: MouseEvent) {
	sandbox.click(event.currentTarget as HTMLElement, event);
}
</script>

<template>
	<PreviewStage v-model="background">
		<div
			class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
		>
			<DemoButton @click="handleClick" />
		</div>

		<div
			ref="host"
			class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
		></div>

		<template #footer-left>
			<p class="text-sm text-subtle">
				Clicking the button calls
				<code class="text-xs text-muted">
					<pre class="inline">run({ target, event })</pre>
				</code
				>, with the button as the target
			</p>
		</template>
	</PreviewStage>
</template>
