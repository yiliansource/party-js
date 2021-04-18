import { deg2rad, rad2deg } from "../systems/math";

/**
 * Represents a structure used to process vectors.
 *
 * @remarks
 * Note that the operations in this class will **not** modify the original vector,
 * except for the property assignments. This is to ensure that vectors are not
 * unintentionally modified.
 *
 * @example
 * ```ts
 * const vectorA = new Vector(1, 3, 5);
 * const vectorB = new Vector(2, 3, 1);
 * const vectorC = vectorA.add(vectorB); // (3, 6, 6)
 * ```
 */
export class Vector {
    /**
     * Returns the x-component of the vector.
     */
    get x(): number {
        return this.values[0];
    }
    /**
     * Modifies the x-component of the vector.
     */
    set x(value: number) {
        this.values[0] = value;
    }

    /**
     * Returns the y-component of the vector.
     */
    get y(): number {
        return this.values[1];
    }
    /**
     * Modifies the y-component of the vector.
     */
    set y(value: number) {
        this.values[1] = value;
    }

    /**
     * Returns the z-component of the vector.
     */
    get z(): number {
        return this.values[2];
    }
    /**
     * Modifies the z-component of the vector.
     */
    set z(value: number) {
        this.values[2] = value;
    }

    /**
     * Returns the xyz-components of the vector, bundled as a copied array.
     */
    get xyz(): [number, number, number] {
        return [this.x, this.y, this.z];
    }
    /**
     * Simultaneously updates the xyz-components of the vector, by passing an array.
     */
    set xyz(values: [number, number, number]) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }

    private values = new Float32Array(3);

    /**
     * Creates a new vector with optional x-, y-, and z-components.
     * Omitted components are defaulted to 0.
     */
    constructor(x = 0, y = 0, z = 0) {
        this.xyz = [x, y, z];
    }

    /**
     * Returns (0, 0, 0).
     */
    public static readonly zero: Vector = new Vector(0, 0, 0);
    /**
     * Returns (1, 1, 1).
     */
    public static readonly one: Vector = new Vector(1, 1, 1);
    /**
     * Returns (1, 0, 0).
     */
    public static readonly right: Vector = new Vector(1, 0, 0);
    /**
     * Returns (0, 1, 0).
     */
    public static readonly up: Vector = new Vector(0, 1, 0);
    /**
     * Returns (0, 0, 1).
     */
    public static readonly forward: Vector = new Vector(0, 0, 1);

    /**
     * Returns the length of the vector.
     */
    public magnitude(): number {
        return Math.sqrt(this.sqrMagnitude());
    }

    /**
     * Returns the squared length of the vector.
     */
    public sqrMagnitude(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * Adds the two vectors together, component-wise.
     */
    public add(vector: Vector): Vector {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        );
    }

    /**
     * Subtracts the right vector from the left one, component-wise.
     */
    public subtract(vector: Vector): Vector {
        return new Vector(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z
        );
    }

    /**
     * Scales the lefthand vector by another vector or by a number.
     */
    public scale(scalar: number | Vector): Vector {
        if (typeof scalar === "number") {
            return new Vector(
                this.x * scalar,
                this.y * scalar,
                this.z * scalar
            );
        } else {
            return new Vector(
                this.x * scalar.x,
                this.y * scalar.y,
                this.z * scalar.z
            );
        }
    }

    /**
     * Normalizes the vector to a length of 1. If the length was previously zero,
     * then a zero-length vector will be returned.
     */
    public normalized(): Vector {
        const magnitude = this.magnitude();
        if (magnitude !== 0) {
            return this.scale(1 / magnitude);
        }
        return new Vector(...this.xyz);
    }

    /**
     * Returns the angle between two vectors, in degrees.
     */
    public angle(vector: Vector): number {
        return (
            rad2deg *
            Math.acos(
                (this.x * vector.x + this.y * vector.y + this.z * vector.z) /
                    (this.magnitude() * vector.magnitude())
            )
        );
    }

    /**
     * Returns the cross-product of two vectors.
     */
    public cross(vector: Vector): Vector {
        return new Vector(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    /**
     * returns the dot-product of two vectors.
     */
    public dot(vector: Vector): number {
        return (
            this.magnitude() *
            vector.magnitude() *
            Math.cos(deg2rad * this.angle(vector))
        );
    }

    /**
     * Returns a formatted representation of the vector.
     */
    public toString(): string {
        return "Vector(" + this.values.join(", ") + ")";
    }

    /**
     * Creates a new vector from an angle, in degrees. Note that the z-component will be zero.
     */
    public static from2dAngle(angle: number): Vector {
        return new Vector(Math.cos(angle * deg2rad), Math.sin(angle * deg2rad));
    }
}
