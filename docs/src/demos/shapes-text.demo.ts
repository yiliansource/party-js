// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		// #region collapse
		size: 100,
		count: 4,
		// #endregion
		shapes: { type: "text", text: "party.js" },
	});
	// #endregion
};
