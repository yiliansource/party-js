// #region import
import { confetti, range } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		count: range(20, 30),
		size: range(16, 24),
		shapes: [
			{
				type: "custom",
				draw(ctx) {
					// draw at a large font size and scale down, since tiny fonts can render blurry
					ctx.scale(0.01, 0.01);
					ctx.font = "100px sans-serif";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("🎉", 0, 0);
				},
			},
		],
	});
	// #endregion
};
