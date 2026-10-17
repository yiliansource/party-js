import { sparkles } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	sparkles(button);
	// #endregion
};
