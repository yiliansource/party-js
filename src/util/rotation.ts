import { Vector } from "../components/vector";
import { epsilon } from "../systems/math";

/**
 * Represents an euler rotation (a vector with components in radians).
 */
export type EulerRotation = Vector;
/**
 * Represents an axis rotation, with a specific, normalized axis and a rotation
 * (in radians) around it.
 */
export interface AxisRotation {
    /**
     * The axis to rotate around.
     */
    axis: Vector;
    /**
     * The amount of rotation, in radians, to apply.
     */
    angle: number;
}

/**
 * Converts the specified euler rotation (in radians) to an axis rotation.
 *
 * @param euler The rotation (in radians) to convert.
 * @returns An object containing the axis vector and the rotation angle (in radians).
 *
 * @see https://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToAngle/
 */
export function eulerToAxis(euler: EulerRotation): AxisRotation {
    const c1 = Math.cos(euler.x / 2);
    const c2 = Math.cos(euler.y / 2);
    const c3 = Math.cos(euler.z / 2);
    const s1 = Math.sin(euler.x / 2);
    const s2 = Math.sin(euler.y / 2);
    const s3 = Math.sin(euler.z / 2);

    const w = c1 * c2 * c3 - s1 * s2 * s3;
    let x = c1 * c2 * s3 + s1 * s2 * c3;
    let y = s1 * c2 * c3 + c1 * s2 * s3;
    let z = c1 * s2 * c3 - s1 * c2 * s3;

    const angle = 2 * Math.acos(w);

    let norm = x * x + y * y + z * z;
    if (norm < epsilon) {
        x = 1;
        y = z = 0;
    } else {
        norm = Math.sqrt(norm);
        x /= norm;
        y /= norm;
        z /= norm;
    }

    return {
        angle,
        axis: new Vector(x, y, z),
    };
}
