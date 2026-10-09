import type { Particle } from "../particle/particle";
import type { Rng } from "../random";

/**
 * Passed to {@link BehaviorObject.init} once, after the particle spawns and before its first update.
 *
 * @summary Context passed to a behavior when a particle spawns.
 *
 * @group Behaviors
 */
export interface BehaviorInitContext {
	/**
	 * The effect's random number generator. Use it in place of `Math.random()` to keep seeded effects reproducible.
	 */
	rng: Rng;
}

/**
 * Passed to a behavior's update function on every simulation step.
 *
 * @summary Context passed to a behavior on every simulation step.
 *
 * @group Behaviors
 */
export interface BehaviorUpdateContext {
	/**
	 * The effect's random number generator. Use it in place of `Math.random()` to keep seeded effects reproducible.
	 */
	rng: Rng;
	/**
	 * The length of this step, in seconds.
	 */
	dt: number;
}

/**
 * A function that prepares a newly spawned particle for a behavior.
 *
 * Called once per particle right after it has been constructed, but before its first update.
 * Initializations are called in the order that the behaviors are listed in.
 * A common usecase is to store initial particle data in {@link Particle.data} or choosing
 * a random initial value for a behavior via the random number generator.
 *
 * @param particle - The new particle.
 * @param ctx - The context supplied to the initialization, including the random number generator.
 *
 * @summary Prepares a newly spawned particle for a behavior.
 *
 * @group Behaviors
 */
export type BehaviorInit = (
	particle: Particle,
	ctx: BehaviorInitContext,
) => void;

/**
 * A function that updates a particle by a single simulation step.
 *
 * Called for every particle on every step, in the order that the behaviors are listed in.
 * Any "per-second" changes should be scaled by `ctx.dt` to make the behavior independant of the step size.
 *
 * @param particle - The particle to be updated.
 * @param ctx - The context supplied to the update, including the random number generator and the time step.
 *
 * @summary Updates a particle by one simulation step.
 *
 * @group Behaviors
 */
export type BehaviorUpdate = (
	particle: Particle,
	ctx: BehaviorUpdateContext,
) => void;

/**
 * A behavior that can also perform initialization when the particle is spawned.
 *
 * This can be used to store initial state in {@link Particle.data} under a {@link Symbol}.
 * Symbols should be created in your behavior's factory function, to ensure that two behavior instances
 * do not overwrite with each other.
 *
 * @summary A behavior with an optional setup step for each particle.
 *
 * @example
 * ```ts
 * const shrink = (): Behavior => {
 *     const startSize = Symbol("startSize");
 * 	   return {
 *         init(particle) {
 *             particle.data.set(startSize, particle.size);
 *         },
 *         update(particle) {
 *             const start = particle.data.get(startSize) as number;
 *             particle.size = start * (1 - particle.age / particle.lifetime);
 *         },
 *     };
 * };
 * ```
 *
 * @group Behaviors
 */
export interface BehaviorObject {
	/**
	 * The initialization function of the behavior, called on every particle once after it was spawned.
	 */
	init?: BehaviorInit;
	/**
	 * The update function of the behavior, called on every particle every simulation step.
	 */
	update: BehaviorUpdate;
}

/**
 * Modifies a particle over their lifetime, for example gravity, drag or fading.
 *
 * Either a plain update function, called for every particle on every step, or a {@link BehaviorObject} when
 * the behavior also needs to perform setup for each new particle. Behaviors run in the order they are listed in.
 *
 * @summary Changes a particle over its lifetime.
 *
 * @group Behaviors
 */
export type Behavior = BehaviorUpdate | BehaviorObject;

export function initBehavior(
	behavior: Behavior,
	particle: Particle,
	ctx: BehaviorInitContext,
): void {
	if (typeof behavior !== "function" && behavior.init !== undefined) {
		behavior.init(particle, ctx);
	}
}

export function applyBehavior(
	behavior: Behavior,
	particle: Particle,
	ctx: BehaviorUpdateContext,
): void {
	const update = typeof behavior === "function" ? behavior : behavior.update;
	update(particle, ctx);
}
