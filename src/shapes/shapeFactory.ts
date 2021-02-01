import Colour from "../util/colour";
import Vector from "../util/vector";
import Shape, { RectShape } from "./shape";

class ShapeFactory {
    public rect(size: Vector, colour: Colour, rounded: number = 0): Shape {
        return new RectShape(size, colour, rounded);
    }
}
export default new ShapeFactory();