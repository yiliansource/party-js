// #region import
import { confetti, range } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		count: range(60, 90),
		spread: 100,
		startVelocity: range(1200, 2000),
	});
	// #endregion
};
