<script setup lang="ts">
import { PlayIcon } from "@lucide/vue";
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from "vue";

import type { PreviewBackground } from "../../shared/preview";
import Button from "../../shared/ui/Button.vue";
import PreviewStage from "../../shared/ui/PreviewStage.vue";
import SwitchField from "../../shared/ui/SwitchField.vue";
import type { AnyEffectDefinition } from "../definitions";
import { effectOptions } from "../effect";
import type { EffectDraft } from "../schema";

const { definition, draft } = defineProps<{
	definition: AnyEffectDefinition;
	draft: EffectDraft;
}>();

const repeat = defineModel<boolean>("repeat", { required: true });
const background = defineModel<PreviewBackground>("background", {
	required: true,
});

const effectSource = useTemplateRef<HTMLDivElement>("effectSource");

const PERIOD = 2000;
let timer: number | undefined;

const onScreen = ref(false);
const pageVisible = ref(!document.hidden);
const looping = computed(
	() => repeat.value && onScreen.value && pageVisible.value,
);

function playEffect() {
	if (!effectSource.value) return;
	definition.fire(effectSource.value, effectOptions(definition, draft));
}
function scheduleEffect() {
	clearTimeout(timer);
	timer = window.setTimeout(() => {
		playEffect();
		scheduleEffect();
	}, PERIOD);
}
function handlePlayEffect() {
	playEffect();
	if (looping.value) scheduleEffect();
}

watch(looping, (on) => {
	clearTimeout(timer);
	if (on) {
		playEffect();
		scheduleEffect();
	}
});

const onVisibility = () => (pageVisible.value = !document.hidden);
let observer: IntersectionObserver | undefined;

onMounted(() => {
	document.addEventListener("visibilitychange", onVisibility);
	observer = new IntersectionObserver(
		([entry]) => (onScreen.value = entry.isIntersecting),
	);
	if (effectSource.value) observer.observe(effectSource.value);

	playEffect();
	scheduleEffect();
});

onBeforeUnmount(() => {
	clearTimeout(timer);
	observer?.disconnect();
	document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
	<PreviewStage v-model="background">
		<div
			ref="effectSource"
			class="absolute w-30 h-15 border-2 border-dashed border-raised rounded-xl left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
		></div>

		<template #actions>
			<SwitchField v-model="repeat" label="Repeat" />
		</template>
		<template #footer>
			<Button
				variant="accent"
				label="Play effect"
				icon-placement="start"
				@click="handlePlayEffect"
			>
				<template v-slot:icon>
					<PlayIcon />
				</template>
			</Button>
		</template>
	</PreviewStage>
</template>
