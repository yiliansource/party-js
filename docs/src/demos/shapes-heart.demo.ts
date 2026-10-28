// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

// #region demo
// a heart, from its bottom tip, around the left half and back down the right
const heart = new Path2D(
	"M0 0.42 C-0.25 0.25 -0.5 0.05 -0.5 -0.17 C-0.5 -0.34 -0.37 -0.45 -0.23 -0.45 C-0.12 -0.45 -0.04 -0.38 0 -0.3 " +
		"C0.04 -0.38 0.12 -0.45 0.23 -0.45 C0.37 -0.45 0.5 -0.34 0.5 -0.17 C0.5 0.05 0.25 0.25 0 0.42 Z",
);
// #endregion

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [{ type: "path", path: heart }],
		colors: ["#ff5a5f", "#ff8fa3", "#e11d48"],
	});
	// #endregion
};
