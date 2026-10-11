import { type Color, color } from "../color/color";
import { type Quat, identity as quatIdentity } from "../math/quat";
import { type Vec3, zero as vec3Zero } from "../math/vec3";
import type { Particle } from "../particle/particle";
import { evaluateSampler } from "../samplers/helpers";
import type { Sampler, SamplerContext } from "../samplers/types";
import type { ParticleShape } from "../shapes/shape";

/**
 * Describes the values that will be assigned to a particle when it's spawned.
 *
 * Every field is a {@link Sampler}: either a fixed value, or a function that's called once for each particle
 * when it spawns, so that particles can differ in appearance. The results become the particle's initial state
 * (see {@link Particle}). After that, behaviors and the simulation steps take over.
 *
 * The values `position`, `velocity`, `orientation` and `angularVelocity` are optional, and default to values
 * producing a particle that starts at the origin, does not move or spin and faces the viewer.
 *
 * @summary Describes the values assigned to a new particle.
 *
 * @example
 * ```ts
 * createEffect({
 *     origin: { x: 200, y: 300 },
 *     schedule: { duration: 1, loops: 1, rate: 0, bursts: [{ time: 0, count: 30 }] },
 *     particleInit: {
 *         position: emitFrom({ type: "disk", radius: 20 }),
 *         velocity: cone(90, 30, range(200, 400)),
 *         orientation: randomOrientation(),
 *         angularVelocity: randomSpin(90, 270),
 *         size: range(8, 14),
 *         color: pick(["#ff5a5f", "#ffb400", "#00a699"]),
 *         shape: { type: "circle" },
 *         lifetime: range(2, 3),
 *     },
 * });
 * ```
 *
 * @group Custom effects
 */
export interface ParticleInit {
	/**
	 * Where the particle spawns, in pixels from the effect's origin, in particle space so +y points upwards.
	 * Use {@link emitFrom | emitFrom()} to spawn particles from an area.
	 *
	 * @defaultValue { x: 0, y: 0, z: 0 }
	 */
	position?: Sampler<Vec3>;
	/**
	 * The particle's starting velocity, in pixels per second. Use {@link cone | cone()} to emit particles in
	 * a direction with some spread.
	 *
	 * @defaultValue { x: 0, y: 0, z: 0 }
	 */
	velocity?: Sampler<Vec3>;
	/**
	 * The particle's initial rotation. Use {@link randomOrientation | randomOrientation()} for a random one.
	 *
	 * @defaultValue { x: 0, y: 0, z: 0, w: 1 }
	 */
	orientation?: Sampler<Quat>;
	/**
	 * How fast the particle spins initially: the direction is the rotation axis (following the right-hand rule) and the
	 * length is the speed in degrees per second. Use {@link randomSpin | randomSpin()} for a random axis and speed.
	 *
	 * @defaultValue { x: 0, y: 0, z: 0 }
	 */
	angularVelocity?: Sampler<Vec3>;
	/**
	 * The particle's initial size, in pixels.
	 */
	size: Sampler<number>;
	/**
	 * The initial color of the particle: a CSS color string or a {@link Color}. Strings are converted
	 * with {@link color | color()} when the particle spawns, so an invalid color throws at that point rather
	 * than when the effect is created.
	 */
	color: Sampler<string | Color>;
	/**
	 * The shape the particle is drawn as. Use {@link pick | pick()} to mix several shapes in the effect.
	 */
	shape: Sampler<ParticleShape>;
	/**
	 * How long the particle lives, in seconds.
	 */
	lifetime: Sampler<number>;
}

const own = <T extends object>(value: T): T => ({ ...value });

export function spawnParticle(
	init: ParticleInit,
	ctx: SamplerContext,
): Particle {
	return {
		position: own(
			init.position ? evaluateSampler(init.position, ctx) : vec3Zero,
		),
		velocity: own(
			init.velocity ? evaluateSampler(init.velocity, ctx) : vec3Zero,
		),
		orientation: own(
			init.orientation
				? evaluateSampler(init.orientation, ctx)
				: quatIdentity,
		),
		angularVelocity: own(
			init.angularVelocity
				? evaluateSampler(init.angularVelocity, ctx)
				: vec3Zero,
		),
		size: evaluateSampler(init.size, ctx),
		color: own(color(evaluateSampler(init.color, ctx))),
		shape: own(evaluateSampler(init.shape, ctx)),
		age: 0,
		lifetime: evaluateSampler(init.lifetime, ctx),
		data: new Map(),
	};
}
