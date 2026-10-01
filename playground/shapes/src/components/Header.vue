<script setup lang="ts">
import FieldStack from "@ui/controls/field/base/FieldStack.vue";
import SwitchInput from "@ui/controls/input/SwitchInput.vue";
import PlaygroundHeader from "@ui/PlaygroundHeader.vue";

import { useShapePlaygroundState } from "../state";

const accentColors = ["#FC6D55", "#E9BB25", "#9D51EA", "#00AF96", "#F43CA0"];

const state = useShapePlaygroundState();
</script>

<template>
	<PlaygroundHeader title="Shapes">
		<div class="flex flex-row divide-x-2 divide-card-muted">
			<div class="pr-6">
				<FieldStack label="Guides">
					<SwitchInput v-model="state.guides" />
				</FieldStack>
			</div>
			<div class="flex flex-col px-6">
				<FieldStack label="Canvas">
					<div
						class="flex flex-row text-xs font-semibold bg-neutral-200 rounded-2xl *:px-4 *:py-1.5 *:rounded-2xl *:cursor-pointer"
					>
						<button
							:class="[state.dark === false ? 'bg-white text-neutral-900 outline-2' : 'text-neutral-500']"
							type="button"
							@click="() => state.dark = false"
						>
							Light
						</button>
						<button
							:class="[state.dark === true ? 'bg-neutral-900 text-white outline-2' : 'text-neutral-500']"
							type="button"
							@click="() => state.dark = true"
						>
							Dark
						</button>
					</div>
				</FieldStack>
			</div>
			<div class="flex flex-col pl-6">
				<FieldStack label="Fill">
					<div class="flex flex-row gap-2">
						<button
							:class="['size-5 rounded-full cursor-pointer', state.accent === color && 'outline-2']"
							type="button"
							v-for="color in accentColors"
							:key="color"
							:style="{ backgroundColor: color }"
							@click="() => state.accent = color"
						></button>
					</div>
				</FieldStack>
			</div>
		</div>
	</PlaygroundHeader>
</template>
