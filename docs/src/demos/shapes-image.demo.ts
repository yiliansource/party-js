// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [{ type: "image", image: "/favicon.svg" }],
		size: 24,
	});
	// #endregion
};
