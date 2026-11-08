<script setup lang="ts">
import { ref } from "vue";

import type { PreviewBackground } from "../../shared/preview.ts";
import PreviewStage from "../../shared/ui/PreviewStage.vue";
import DemoButton from "./DemoButton.vue";

const background = ref<PreviewBackground>("dark");
</script>

<template>
	<PreviewStage v-model="background">
		<div
			class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
		>
			<DemoButton />
		</div>

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
