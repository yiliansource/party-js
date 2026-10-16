import { prefersReducedMotion } from "../shared/preference";
import type { PreviewBackground } from "../shared/preview";
import type { PreviewColor } from "./colors";

export interface PreviewSettings {
	color: PreviewColor;
	size: number;
	lighting: boolean;
	background: PreviewBackground;
	paused: boolean;
}

export const createPreview = (): PreviewSettings => ({
	color: "mixed",
	size: 16,
	lighting: true,
	background: "page",
	paused: prefersReducedMotion(),
});
