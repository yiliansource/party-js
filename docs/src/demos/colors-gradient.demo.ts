// #region import
import { confetti, gradient } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		colors: gradient(["#7b61ff", "#ff5a5f", "#ffb400"]),
	});
	// #endregion
};
