// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

// #region demo
// a plus sign, drawn inside the 1x1 box around (0, 0)
const plus = new Path2D("M-0.15-0.5h0.3v0.35h0.35v0.3h-0.35v0.35h-0.3v-0.35h-0.35v-0.3h0.35z");
// #endregion

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [{ type: "path", path: plus }],
	});
	// #endregion
};
