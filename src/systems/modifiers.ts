import { Spline } from "../components/spline";
import { Particle } from "../particles/particle";

/**
 * Represents a junction of types that can be used as a modifier function of a particle module.
 * This can either be constant, a spline, or an evaluateable function.
 */
export type ParticleModifier<T> = T | Spline<T> | ((particle: Particle) => T);

/**
 * Evaluates the specified modifier, using the particle's lifetime as a percentage, if the modifier
 * is given as a spline.
 *
 * @param modifier The modifier to evaluate.
 * @param particle The particle used as a context during evaluation.
 */
export function evaluateModifierViaLifetime<T>(
    modifier: ParticleModifier<T>,
    particle: Particle
): T {
    if (typeof modifier === "object" && "evaluate" in modifier) {
        return modifier.evaluate(
            (particle.initialLifetime - particle.lifetime) / particle.lifetime
        );
    }
    if (typeof modifier === "function") {
        return (modifier as (particle: Particle) => T)(particle);
    }
    return modifier;
}

/**
 * Evaluates the specified modifier, using the particle's size as a percentage, if the modifier
 * is given as a spline.
 *
 * @param modifier The modifier to evaluate.
 * @param particle The particle used as a context during evaluation.
 */
export function evaluateModifierViaSize<T>(
    modifier: ParticleModifier<T>,
    particle: Particle
): T {
    if (typeof modifier === "object" && "evaluate" in modifier) {
        return modifier.evaluate(particle.size);
    }
    if (typeof modifier === "function") {
        return (modifier as (particle: Particle) => T)(particle);
    }
    return modifier;
}
