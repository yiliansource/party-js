<script setup lang="ts">
import { computed } from "vue";

import { pathMask } from "../render/pathMask";

const { path } = defineProps<{ path: Path2D }>();
const mask = computed(() => pathMask(path));
</script>

<template>
	<span
		class="block size-5 bg-current"
		:style="{ maskImage: mask, maskSize: 'contain', maskRepeat: 'no-repeat' }"
		aria-hidden="true"
	></span>
</template>
