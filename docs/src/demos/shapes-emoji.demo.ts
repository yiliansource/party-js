// #region import
import { confetti } from "party-js";
// #endregion
import { range } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		// #region collapse
		count: 10,
		size: range(20, 30),
		lifetime: range(1, 2),
		// #endregion
		shapes: [
			{ type: "text", text: "😄" },
			{ type: "text", text: "😝" },
		],
	});
	// #endregion
};
