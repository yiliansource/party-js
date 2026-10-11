import type { Color } from "../color/color";
import type { Quat } from "../math/quat";
import type { Vec3 } from "../math/vec3";
import type { ParticleShape } from "../shapes/shape";

/**
 * The state of a single particle while it is alive.
 *
 * Particles live in particle space, measured in pixels from the effect's origin: +x points right, +y points up
 * and +z points out of the screen towards the viewer. Particles are drawn without perspective, so the z-axis
 * only matters for directions, not positions.
 *
 * On every simulation step, the particle's `age` advances first. If the particle is still alive,
 * the behaviors run in the order they are listed in the effect. Then the particle is moved by `velocity`
 * and rotated by `angularVelocity`. A particle is removed (i.e. it dies) once its `age` reaches its `lifetime`.
 *
 * Each particle has its own copies of its vectors, color and shape, so behaviors can change them in place
 * or replace them. The only exception is the `path` of a {@link PathShape}, which is shared with other particles
 * possessing the same shape.
 *
 * @summary The state of a single particle.
 *
 * @group Particles
 */
export interface Particle {
	/**
	 * Where the particle is, in pixels from the effect's origin, in particle space.
	 */
	position: Vec3;
	/**
	 * How fast the particle moves, in px/s. Applied to `position` on every step, after the behaviors have run.
	 */
	velocity: Vec3;
	/**
	 * How the particle is rotated. With no rotation, the shape faces the viewer and is drawn exactly as it's shape defines.
	 */
	orientation: Quat;
	/**
	 * How fast the particle spins. The direction is the rotation axis (following the right-hand rule), and the
	 * length is the speed in degrees per second.
	 */
	angularVelocity: Vec3;
	/**
	 * The particle's size, in pixels. It's shape's 1x1 box is scaled to this size.
	 */
	size: number;
	/**
	 * The particle's color, before lighting is applied.
	 */
	color: Color;
	/**
	 * The shape the particle is drawn as.
	 */
	shape: ParticleShape;
	/**
	 * How long the particle has been alive, in seconds.
	 */
	age: number;
	/**
	 * How long the particle lives, in seconds. It's removed (i.e. it dies) once `age` reaches this value.
	 */
	lifetime: number;
	/**
	 * Storage for behaviors that need to remember something per particle, for example an initial value.
	 * It is recommended to use a `Symbol` created in the behavior's factory function as the key,
	 * so that two behaviors never overwrite each other's entries. See {@link BehaviorObject}.
	 */
	data: Map<symbol, unknown>;
}
