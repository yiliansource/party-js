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

    /**
     * Returns a new document-space rectangle from the viewport's bounds.
     */
    public static fromScreen(): Rect {
        return new Rect(
            window.scrollX,
            window.scrollY,
            window.innerWidth,
            window.innerHeight
        );
    }

    /**
     * Returns a new document-space rectangle from the specified element.
     */
    public static fromElement(element: HTMLElement): Rect {
        const r = element.getBoundingClientRect();
        return new Rect(
            window.scrollX + r.x,
            window.scrollY + r.y,
            r.width,
            r.height
        );
    }
}
