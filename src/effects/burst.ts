import { emitFrom } from "../emitter";
import { createRng } from "../random/rng";
import type { BaseEffectOptions } from "./effect";
import { type EffectTarget, measureTarget } from "./target";

export function burstFrom(
	target: EffectTarget,
	options: BaseEffectOptions = {},
) {
	const rng = createRng(options.seed);
	const { origin, area } = measureTarget(target, options.canvas);

	// the middle of an element, rather than its whole area, so the burst comes out of a single spot
	const radius =
		area.type === "rect" ? Math.min(area.width, area.height) / 4 : 0;

	return {
		rng,
		ctx: { rng, index: 0 },
		origin,
		position: emitFrom({ type: "disk", radius }),
	};
}
