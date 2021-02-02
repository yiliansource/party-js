/**
 * Represents a three-dimensional vector.
 */
export default class Vector {
    /**
     * The X component of the vector.
     */
    get x(): number {
        return this.values[0];
    }
    set x(value: number) {
        this.values[0] = value;
    }

    /**
     * The Y component of the vector.
     */
    get y(): number {
        return this.values[1];
    }
    set y(value: number) {
        this.values[1] = value;
    }

    /**
     * The Z component of the vector.
     */
    get z(): number {
        return this.values[2];
    }
    set z(value: number) {
        this.values[2] = value;
    }

    /**
     * Retrieves the XYZ components as an array.
     */
    get xyz() {
        return [this.x, this.y, this.z];
    }
    set xyz(values: [number, number, number]) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }

    private values = new Float32Array(3);

    /**
     * Creates a new vector, with components initialized to zero by default.
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.xyz = [x, y, z];
    }

    public static readonly zero = new Vector(0, 0, 0);
    public static readonly one = new Vector(1, 1, 1);
    public static readonly right = new Vector(1, 0, 0);
    public static readonly up = new Vector(0, 1, 0);
    public static readonly forward = new Vector(0, 0, 1);

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
     * Flips the vector around.
     */
    public flip(): Vector {
        return this.scale(-1);
    }

    /**
     * Adds the given vector to the current one.
     */
    public add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    /**
     * Subtracts the given vector from the current one.
     */
    public subtract(vector: Vector): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    /**
     * Scales the given by vector by a number or component-wise by a vector.
     */
    public scale(scalar: number | Vector): Vector {
        if (typeof scalar === "number") {
            return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
        }
        else {
            return new Vector(this.x * scalar.x, this.y * scalar.y, this.z * scalar.z);
        }
    }

    /**
     * Returns the current vector, normalized. Does nothing for zero-magnitude vectors.
     */
    public normalized(): Vector {
        const magnitude = this.magnitude();
        if (magnitude !== 0) {
            return this.scale(1 / magnitude);
        }
        return this;
    }

    /**
     * Returns the angle, in radians, between this vector and another one.
     */
    public angle(vector: Vector): number {
        return Math.acos((this.x * vector.x + this.y * vector.y + this.z * vector.z) / (this.magnitude() * vector.magnitude()));
    }

    /**
     * Returns the cross product of two vectors.
     */
    public cross(vector: Vector): Vector {
        return new Vector(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    /**
     * Returns the dot product of two vectors.
     */
    public dot(vector: Vector): number {
        return this.magnitude() * vector.magnitude() * Math.cos(this.angle(vector));
    }

    /**
     * Returns a nicely formatted representation of the vector.
     */
    public toString(): string {
        return 'Vector(' + this.values.join(', ') + ')';
    }

    /**
     * Returns a directional vector from euler rotation angles.
     */
    public static fromLookAngles(angles: Vector): Vector {
        return new Vector(
            Math.cos(angles.x) * Math.sin(angles.y),
            Math.sin(angles.x),
            Math.cos(angles.x) * Math.cos(angles.y)
        );
    }
}