// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ event }) => {
	// #region demo
	confetti({ x: event.pageX, y: event.pageY });
	// #endregion
};
