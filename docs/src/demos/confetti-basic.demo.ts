import { confetti } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ button }) => {
	// #region demo
	confetti(button);
	// #endregion
};
