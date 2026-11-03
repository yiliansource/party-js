import * as quat from "../math/quat";
import * as vec3 from "../math/vec3";
import type { Particle } from "../particle";
import { evaluateSampler } from "../samplers/helpers";
import type { Sampler } from "../samplers/types";
import type { Behavior } from "./behavior";

/**
 * Creates a behavior that applies air resistance proportional to a particle's speed.
 *
 * Every second, a particle loses the fraction `rate` of its velocity. A fast particle therefore slows down sharply
 * at first, then more and more gently. Together with {@link gravity | gravity()}, a falling particle speeds up
 * until it reaches its terminal velocity of `gravity / rate`, so if you know how fast particles should fall,
 * use `drag(gravity / terminalVelocity)`. The rate is sampled once for each particle, when it spawns.
 *
 * Flat particles like paper feel more resistance when they move face-on than when they move edge-on. Set
 * `edgeRatio` below 1 to simulate this: a tilted particle then glides sideways while it falls, and as it tumbles,
 * the glide reverses, so it sways back and forth. The face is the plane of the particle's shape, so this needs
 * particles that spin, for example with {@link randomSpin | randomSpin()}. On average over all orientations,
 * the drag stays at `rate`, so the terminal velocity stays close to `gravity / rate`.
 *
 * @param rate - The fraction of its velocity a particle loses per second, in 1/s. Values between 2 and 10
 * are usually sensible. Sampled for each particle.
 * @param edgeRatio - How much drag a particle feels when it moves edge-on, relative to face-on. 1 makes drag
 * the same in every direction. Values between 0.3 and 0.5 give a paper-like flutter, while lower values make
 * particles glide far to the side. Defaults to 1.
 *
 * @summary Slows particles down in proportion to their speed.
 *
 * @example
 * ```ts
 * // Falls at most 160px/s under gravity(800), and flutters like paper.
 * const behaviors = [gravity(800), drag(800 / 160, 0.4)];
 * ```
 *
 * @see {@link https://lampz.tugraz.at/~hadley/physikm/script/motion/terminal.en.php | Terminal Velocity - Falling with a Linear Drag Force}
 *
 * @group Behaviors
 */
export function drag(rate: Sampler<number>, edgeRatio = 1): Behavior {
	const rateMap = new WeakMap<Particle, number>();
	// chosen so that the face-on and edge-on rates average out to `rate` over all orientations,
	// since a direction lies along the normal with weight 1/3, and in the plane with weight 2/3
	const faceScale = 3 / (1 + 2 * edgeRatio);

	return {
		init(particle, ctx) {
			rateMap.set(
				particle,
				evaluateSampler(rate, { rng: ctx.rng, index: 0 }),
			);
		},
		update(particle, ctx) {
			const r = rateMap.get(particle) as number;
			if (edgeRatio === 1) {
				particle.velocity = vec3.scale(
					particle.velocity,
					Math.exp(-r * ctx.dt),
				);
				return;
			}

			const faceDecay = Math.exp(-r * faceScale * ctx.dt);
			const edgeDecay = Math.exp(-r * faceScale * edgeRatio * ctx.dt);
			const normal = quat.basis(particle.orientation).z;
			const along = vec3.scale(
				normal,
				vec3.dot(particle.velocity, normal),
			);
			const across = vec3.sub(particle.velocity, along);
			particle.velocity = vec3.add(
				vec3.scale(along, faceDecay),
				vec3.scale(across, edgeDecay),
			);
		},
	};
}
