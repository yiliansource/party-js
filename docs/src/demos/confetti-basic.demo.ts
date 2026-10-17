import { confetti } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button);
	// #endregion
};
