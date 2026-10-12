import { confetti } from "party-js";
import type { Demo } from "./types";

export const run: Demo = ({ event }) => {
	// #region demo
	confetti({ x: event.pageX, y: event.pageY });
	// #endregion
};
