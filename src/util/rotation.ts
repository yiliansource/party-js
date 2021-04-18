import { Vector } from "../components";
import { deg2rad } from "../systems/math";

/**
 * Converts the specified euler rotation (in degrees) into the corresponding normal vector.
 *
 * @remarks
 * The normal is calculated by placing a (figurative) plane in a coordinate-system's
 * origin, and rotating it by the specified angles. Note that the z-component of the
 * rotation is irrelevant for the normal and can be ignored. Then, two vectors
 * describing the orientation of the plane are calculated. Their cross product
 * denotes the normal vector.
 *
 * @param rotation The euler rotation angles (in degrees) to calculate the normal for.
 */
export function rotationToNormal(rotation: Vector): Vector {
    const alpha = rotation.x * deg2rad;
    const beta = rotation.y * deg2rad;

    const a = new Vector(Math.cos(beta), 0, Math.sin(beta));
    const b = new Vector(0, Math.cos(alpha), Math.sin(alpha));

    return a.cross(b);
}
