import type { Particle } from "../particle/particle";
import type { Rng } from "../random";

/**
 * @group Behaviors
 */
export interface BehaviorInitContext {
	rng: Rng;
}

/**
 * @group Behaviors
 */
export interface BehaviorUpdateContext {
	rng: Rng;
	dt: number;
}

/**
 * @group Behaviors
 */
export type BehaviorInit = (
	particle: Particle,
	ctx: BehaviorInitContext,
) => void;

/**
 * @group Behaviors
 */
export type BehaviorUpdate = (
	particle: Particle,
	ctx: BehaviorUpdateContext,
) => void;

/**
 * @group Behaviors
 */
export interface BehaviorObject {
	init?: BehaviorInit;
	update: BehaviorUpdate;
}

/**
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
