import type { Particle } from "../particle/particle";
import type { Rng } from "../random";

export interface BehaviorInitContext {
	rng: Rng;
}

export interface BehaviorUpdateContext {
	rng: Rng;
	dt: number;
}

export type BehaviorInit = (
	particle: Particle,
	ctx: BehaviorInitContext,
) => void;

export type BehaviorUpdate = (
	particle: Particle,
	ctx: BehaviorUpdateContext,
) => void;

export interface BehaviorObject {
	init?: BehaviorInit;
	update: BehaviorUpdate;
}

export type Behavior = BehaviorUpdate | BehaviorObject;

export function initBehavior(
	behavior: Behavior,
	particle: Particle,
	ctx: BehaviorUpdateContext,
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
