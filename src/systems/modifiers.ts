import { Spline } from "../components/spline";
import { Particle } from "../particles/particle";

/**
 * Represents a junction of types that can be used as a modifier function of a particle module.
 * This can either be constant, a spline, or an evaluateable function.
 */
export type ParticleModifier<T> = T | Spline<T> | ((particle: Particle) => T);

/**
 * Evaluates a particle modifier using the specified particle context.
 *
 * @param modifier The modifier to evaluate.
 * @param particle The particle to evaluate the modifier with.
 */
export function evaluateModifier<T>(
    modifier: ParticleModifier<T>,
    particle: Particle
): T {
    if (typeof modifier === "object" && "evaluate" in modifier) {
        const elapsedLifetime = particle.initialLifetime - particle.lifetime;
        const lifetimePercentage = elapsedLifetime / particle.lifetime;
        return modifier.evaluate(lifetimePercentage);
    }
    if (typeof modifier === "function")
        return (modifier as (particle: Particle) => T)(particle);
    return modifier;
}
