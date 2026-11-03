import type { Behavior } from "./behavior";
import { type Easing, linear } from "./easing";
import { type EnvelopeTarget, envelope } from "./envelope";

const alpha: EnvelopeTarget = {
	read: (p) => p.color.alpha,
	write: (p, v) => (p.color = { ...p.color, alpha: v }),
};

/**
 * Creates a behavior that fades a particle's opacity in and out over the specified durations.
 *
 * The fade-in takes place during the first `inDuration` seconds of a particle's lifetime, while
 * the fade-out happens during the last `outDuration` seconds of the particle's lifetime. The
 * supplied easing is applied forwards when fading in, and in reverse when fading out.
 *
 * @param inDuration - The duration in seconds it takes for the particle to fade in fully, or
 * 0 if no fade-in should be applied.
 * @param outDuration - The duration in seconds it takes for the particle to fade out fully, or
 * 0 if no fade-out should be applied.
 * @param ease - How the transition progresses. Defaults to {@link linear | linear()}.
 *
 * @summary Fades a particle in and out.
 *
 * @group Behaviors
 */
export function fade(
	inDuration: number,
	outDuration: number,
	ease?: Easing,
): Behavior {
	return envelope(alpha, inDuration, outDuration, ease);
}
