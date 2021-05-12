/**
 * Represents a rectangle with an origin and size.
 */
export class Rect {
    /**
     * The x-position of the rectangle.
     */
    x: number;
    /**
     * The y-position of the rectangle.
     */
    y: number;
    /**
     * The width of the rectangle.
     */
    width: number;
    /**
     * The height of the rectangle.
     */
    height: number;

    constructor(x: number, y: number, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static readonly zero: Rect = new Rect(0, 0);
}
