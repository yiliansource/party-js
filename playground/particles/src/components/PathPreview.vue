<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(
	defineProps<{
		path: Path2D;
		size?: number;
		dark?: boolean;
	}>(),
	{
		size: 48,
		dark: true,
	},
);

const canvas = ref<HTMLCanvasElement | null>(null);

function draw(): void {
	const el = canvas.value;
	if (!el) return;

	const ctx = el.getContext("2d");
	if (!ctx) return;

	el.width = props.size;
	el.height = props.size;

	ctx.translate(props.size / 2, props.size / 2);
	ctx.scale(props.size, props.size);

	ctx.fillStyle = "#FC6D55";
	ctx.fill(props.path);
	ctx.restore();
}

onMounted(draw);
watch(() => [props.path, props.size, props.dark], draw);
</script>

<template>
	<div
		class="p-2 rounded-lg"
		:style="{ backgroundColor: props.dark ? '#1c1b1a' : '#efebe2'}"
	>
		<canvas ref="canvas" class="block size-6 m-auto" />
	</div>
</template>
