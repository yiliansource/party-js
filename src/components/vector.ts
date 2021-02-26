export default class Vector {
    get x(): number {
        return this.values[0];
    }
    set x(value: number) {
        this.values[0] = value;
    }

    get y(): number {
        return this.values[1];
    }
    set y(value: number) {
        this.values[1] = value;
    }

    get z(): number {
        return this.values[2];
    }
    set z(value: number) {
        this.values[2] = value;
    }

    get xyz(): [number, number, number] {
        return [this.x, this.y, this.z];
    }
    set xyz(values: [number, number, number]) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }

    private values = new Float32Array(3);

    constructor(x = 0, y = 0, z = 0) {
        this.xyz = [x, y, z];
    }

    public static readonly zero = new Vector(0, 0, 0);
    public static readonly one = new Vector(1, 1, 1);
    public static readonly right = new Vector(1, 0, 0);
    public static readonly up = new Vector(0, 1, 0);
    public static readonly forward = new Vector(0, 0, 1);

    public magnitude(): number {
        return Math.sqrt(this.sqrMagnitude());
    }

    public sqrMagnitude(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public add(vector: Vector): Vector {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
        );
    }

    public subtract(vector: Vector): Vector {
        return new Vector(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z
        );
    }

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

    public normalized(): Vector {
        const magnitude = this.magnitude();
        if (magnitude !== 0) {
            return this.scale(1 / magnitude);
        }
        return this;
    }

    public angle(vector: Vector): number {
        return Math.acos(
            (this.x * vector.x + this.y * vector.y + this.z * vector.z) /
                (this.magnitude() * vector.magnitude())
        );
    }

    public cross(vector: Vector): Vector {
        return new Vector(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    public dot(vector: Vector): number {
        return (
            this.magnitude() * vector.magnitude() * Math.cos(this.angle(vector))
        );
    }

    public toString(): string {
        return "Vector(" + this.values.join(", ") + ")";
    }

    public static fromLookAngles(angles: Vector): Vector {
        return new Vector(
            Math.cos(angles.x) * Math.sin(angles.y),
            Math.sin(angles.x),
            Math.cos(angles.x) * Math.cos(angles.y)
        );
    }
}
