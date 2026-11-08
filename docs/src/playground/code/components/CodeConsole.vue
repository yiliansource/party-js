<script setup lang="ts">
import { BanIcon } from "@lucide/vue";

import Button from "../../shared/ui/Button.vue";
import Panel from "../../shared/ui/Panel.vue";
</script>

<template>
	<Panel title="Console" class="relative">
		<div class="absolute top-2 right-2">
			<Button
				variant="ghost"
				size="sm"
				label="Clear"
				icon-placement="start"
			>
				<template v-slot:icon>
					<BanIcon slot="icon" />
				</template>
			</Button>
		</div>
		<div
			class="grid grid-cols-[80px_minmax(0,1fr)] font-mono text-sm text-subtle"
		>
			<span>14:02:11</span>
			<span>Ran effect.js</span>
			<span>14:02:12</span>
			<span>Failed</span>
		</div>
	</Panel>
</template>
