import { setDefaultReducedMotion } from "party-js";

const KEY = "party-js:play-effects";

function stored(): boolean {
	try {
		return localStorage.getItem(KEY) === "true";
	} catch {
		return false;
	}
}

function apply(play: boolean): void {
	setDefaultReducedMotion(play ? "play" : "skip");
	for (const toggle of document.querySelectorAll<HTMLInputElement>(
		"[data-play-effects]",
	)) {
		toggle.checked = play;
	}
}

apply(stored());

document.addEventListener("change", (event) => {
	const target = event.target;
	if (
		!(target instanceof HTMLInputElement) ||
		!target.matches("[data-play-effects]")
	)
		return;

	try {
		localStorage.setItem(KEY, String(target.checked));
	} catch {}

	apply(target.checked);
});
