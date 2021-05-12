/**
 * Represents a circle.
 */
export class Circle {
    /**
     * The x-coordinate of the circle.
     */
    x: number;
    /**
     * The y-coordinate of the circle.
     */
    y: number;
    /**
     * The radius of the circle.
     *
     * @defaultValue 0
     */
    radius: number;

    /**
     * Creates a new circle at the specified coordinates, with a default radius of 0.
     */
    constructor(x: number, y: number, radius = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public static readonly zero = new Circle(0, 0);
}
