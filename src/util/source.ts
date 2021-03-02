import { Rect } from "../components/rect";

/**
 * Represents a point on the screen.
 */
export type Point = { x: number; y: number };
/**
 * Represents a junction of types that can be used as particle system sources.
 */
export type Source = Point | HTMLElement | MouseEvent;

/**
 * Converts a particle system source to an actual rectangle.
 *
 * @param source The junction of types to convert.
 * @returns A rectangle representing the converted source.
 */
export function sourceToRect(source: Source): Rect {
    if ("x" in source && "y" in source) {
        // Handle the source as a point.
        return {
            x: source.x,
            y: source.y,
            width: 0,
            height: 0,
        };
    } else if ("clientLeft" in source && "clientTop" in source) {
        // Handle the source as an HTMLElement.
        return source.getBoundingClientRect();
    } else {
        // TODO: Maybe check the type here aswell and throw an error if none match?
        // Handle the source as a mouse event.
        return {
            x: (source as MouseEvent).clientX,
            y: (source as MouseEvent).clientY,
            width: 0,
            height: 0,
        };
    }
}
