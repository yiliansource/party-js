// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [
			{ type: "square" },
			{ type: "square", aspectRatio: 0.4, cornerRadius: 0.2 },
			{ type: "circle" },
			{ type: "star", points: 5 },
			{ type: "polygon", sides: 6 },
		],
	});
	// #endregion
};
