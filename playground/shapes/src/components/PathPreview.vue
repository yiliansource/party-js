<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(
	defineProps<{
		path: Path2D;
		size?: number;
		fillStyle?: string;
		dark?: boolean;
		showGuides?: boolean;
	}>(),
	{
		size: 200,
		fillStyle: "#4f83cc",
		dark: true,
		showGuides: true,
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

	if (props.showGuides) {
		ctx.save();
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 1 / props.size;
		ctx.strokeRect(-0.5, -0.5, 1, 1);
		ctx.restore();
	}

	ctx.fillStyle = props.fillStyle;
	ctx.fill(props.path);
	ctx.restore();
}

onMounted(draw);
watch(
	() => [
		props.path,
		props.size,
		props.fillStyle,
		props.dark,
		props.showGuides,
	],
	draw,
);
</script>

<template>
	<div
		class="flex h-52 w-full rounded-xl"
		:style="{ backgroundColor: props.dark ? '#1c1b1a' : '#efebe2'}"
	>
		<canvas ref="canvas" class="block size-24 m-auto" />
	</div>
</template>
