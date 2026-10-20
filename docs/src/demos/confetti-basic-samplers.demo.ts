// #region import
import { confetti, pick, randomHue } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: pick([{ type: "circle" }, { type: "star" }], [4, 1]),
		colors: randomHue({ l: 0.65, c: 0.08 }),
	});
	// #endregion
};
