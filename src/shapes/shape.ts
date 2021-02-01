import Colour from "../util/colour";
import Vector from "../util/vector";

export default abstract class Shape {
    public size: Vector;
    public colour: Colour;

    constructor(size: Vector, colour: Colour) {
        this.size = size;
        this.colour = colour;
    }

    public abstract toHtml(): HTMLElement;
}

export class RectShape extends Shape {
    constructor(size: Vector, colour: Colour, rounded: number = 0) {
        super(size, colour);

        this.rounded = rounded;
    }

    public rounded: number;

    public toHtml(): HTMLDivElement {
        const element = document.createElement("div");
        element.style.width = this.size.x + "px";
        element.style.height = this.size.y + "px";
        element.style.borderRadius = this.rounded + "px";
        element.style.backgroundColor = this.colour.toHex();
        return element;
    }
}