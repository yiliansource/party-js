// #region demo
import { confetti, range } from "party-js";
// #endregion

import type { Demo } from "./types";

export const run: Demo = ({ button }) => {
	// #region demo
	confetti(button, {
		count: range(80, 120),
		spread: 120,
		startVelocity: range(400, 700),
	});
	// #endregion
};
