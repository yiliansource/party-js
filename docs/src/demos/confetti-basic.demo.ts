// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button);
	// #endregion
};
