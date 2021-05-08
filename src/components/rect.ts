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

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static fromHtmlElement(element: HTMLElement): Rect {
        const bounds = element.getBoundingClientRect();
        return new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    public static fromMouseEvent(e: MouseEvent): Rect {
        return new Rect(e.clientX, e.clientY);
    }
}
