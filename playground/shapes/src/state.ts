import { type InjectionKey, inject, provide, reactive } from "vue";

interface ShapePlaygroundState {
	accent: string;
	dark: boolean;
	guides: boolean;
}

const key: InjectionKey<ShapePlaygroundState> = Symbol(
	"shape-playground-state",
);

export function provideShapePlaygroundState() {
	const state = reactive<ShapePlaygroundState>({
		accent: "#FC6D55",
		dark: true,
		guides: false,
	});
	provide(key, state);
	return state;
}

export function useShapePlaygroundState(): ShapePlaygroundState {
	const state = inject(key);
	if (!state)
		throw new Error(
			"useShapePlaygroundState() called outside provideShapePlaygroundState()",
		);

	return state;
}
