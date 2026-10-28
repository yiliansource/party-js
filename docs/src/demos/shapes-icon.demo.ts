// #region import
import { confetti, range } from "party-js";
// #endregion
import type { Demo } from "./types";

// #region demo
// a lightning bolt, drawn on a 24x24 grid
const bolt = new Path2D();
bolt.addPath(new Path2D("M13 2 3 14h9l-1 8 10-12h-9l1-8z"), new DOMMatrix().scale(1 / 24).translate(-12, -12));
// #endregion

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [{ type: "path", path: bolt }],
		colors: ["#ffb400", "#ffd166"],
		size: range(16, 24),
	});
	// #endregion
};
