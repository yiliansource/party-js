// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

// #region demo
const logo = new Image();
logo.src = "/favicon.svg";
// #endregion

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button, {
		shapes: [
			{
				type: "custom",
				draw(ctx) {
					// draw nothing until the image has loaded
					if (logo.complete) ctx.drawImage(logo, -0.5, -0.5, 1, 1);
				},
			},
		],
		size: 24,
	});
	// #endregion
};
