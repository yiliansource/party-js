import { type InjectionKey, inject, provide, reactive } from "vue";

interface PlaygroundState {
	accent: string;
	dark: boolean;
	guides: boolean;
}

const key: InjectionKey<PlaygroundState> = Symbol("playground-state");

export function providePlaygroundState() {
	const state = reactive<PlaygroundState>({
		accent: "#FC6D55",
		dark: true,
		guides: false,
	});
	provide(key, state);
	return state;
}

export function usePlaygroundState(): PlaygroundState {
	const state = inject(key);
	if (!state)
		throw new Error(
			"usePlaygroundState() called outside providePlaygroundState()",
		);

	return state;
}
