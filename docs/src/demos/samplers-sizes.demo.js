// @ts-check
// #region import
import { confetti, evaluateSampler, pick, range } from "party-js";
// #endregion

/** @import { Demo } from "./types" */
/** @import { SamplerFn } from "party-js" */

// #region demo
// mostly small confetti, with a few large pieces
const sizes = pick([range(4, 8), range(14, 20)], [5, 1]);
// #region omit
/** @type {SamplerFn<number>} */
// #endregion
const size = (ctx) => evaluateSampler(sizes(ctx), ctx);
// #endregion

/** @type {Demo} */
export const run = ({ target: button }) => {
	// #region demo
	confetti(button, { size });
	// #endregion
};
