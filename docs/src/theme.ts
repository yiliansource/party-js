export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "light";
export const THEME_KEY = "partyjs-theme";

export function getTheme(): Theme {
	const dataTheme = document.documentElement.dataset.theme;
	if (dataTheme !== "dark" && dataTheme !== "light") return DEFAULT_THEME;
	return dataTheme;
}

export function storeTheme(theme: Theme): void {
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {}
}
