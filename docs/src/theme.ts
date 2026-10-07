export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "light";
export const THEME_KEY = "partyjs-theme";

export const THEME_COLORS = {
	light: "#FFFFFF",
	dark: "#1A1A1A",
} as const;

export function applyTheme(theme: Theme): void {
	document.documentElement.dataset.theme = theme;
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", THEME_COLORS[theme]);

	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {}
}

export function getTheme(): Theme {
	const dataTheme = document.documentElement.dataset.theme;
	if (dataTheme !== "dark" && dataTheme !== "light") return DEFAULT_THEME;
	return dataTheme;
}
