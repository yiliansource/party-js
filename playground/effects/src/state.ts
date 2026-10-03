import { type InjectionKey, inject, provide, reactive } from "vue";

type EffectPlaygroundState = {
	active: number;
};

const key: InjectionKey<EffectPlaygroundState> = Symbol(
	"effect-playground-state",
);

export function provideEffectPlaygroundState() {
	const state = reactive<EffectPlaygroundState>({
		active: 0,
	});
	provide(key, state);
	return state;
}

export function useEffectPlaygroundState(): EffectPlaygroundState {
	const state = inject(key);
	if (!state)
		throw new Error(
			"useEffectPlaygroundState() called outside provideEffectPlaygroundState()",
		);

	return state;
}
