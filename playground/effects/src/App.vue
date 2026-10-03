<script setup lang="ts">
import { PartyPopper, Sparkle } from "@lucide/vue";

import { confetti } from "@/effects/confetti.ts";
import { sparkles } from "@/effects/sparkles.ts";
import { range } from "@/samplers/numeric.ts";

import EffectCard from "./components/EffectCard.vue";
import EffectSection from "./components/EffectSection.vue";
import Header from "./components/Header.vue";
import ScrollBreaker from "./components/ScrollBreaker.vue";
import { provideEffectPlaygroundState } from "./state.ts";

provideEffectPlaygroundState();
</script>

<template>
	<Header />
	<div class="px-12 py-4 border-b-2 border-card-muted">
		<div class="flex flex-row gap-6 text-sm text-content-secondary">
			<p class="font-semibold">Jump to:</p>
			<a href="#confetti">Confetti</a>
			<a href="#sparkles">Sparkles</a>
		</div>
	</div>
	<div class="px-12 py-6">
		<EffectSection
			id="confetti"
			title="Confetti"
			signature="confetti(element, options?)"
		>
			<template #icon>
				<PartyPopper class="size-8" />
			</template>
			<EffectCard title="Default" :trigger="(el) => confetti(el)">
				<p>No overrides.</p>
			</EffectCard>
			<EffectCard
				title="Narrow & fast"
				:trigger="(el) => confetti(el, {
				spread: 10,
				startVelocity: range(800, 1000)
			})"
			>
				<p class="font-mono">
					spread: 10, startVelocity: range(800, 1000)
				</p>
			</EffectCard>
		</EffectSection>

		<ScrollBreaker />

		<EffectSection
			id="sparkles"
			title="Sparkles"
			signature="sparkles(element, options?)"
		>
			<template #icon>
				<Sparkle />
			</template>
			<EffectCard title="Default" :trigger="(el) => sparkles(el)">
				<p>No overrides.</p>
			</EffectCard>
		</EffectSection>

		<ScrollBreaker />
	</div>
</template>
