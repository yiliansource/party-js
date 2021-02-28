import { Rect } from "../components/rect";

export type Point = { x: number; y: number };
export type Source = Point | HTMLElement | MouseEvent;

export function sourceToRect(source: Source): Rect {
    if ("x" in source && "y" in source) {
        return {
            x: source.x,
            y: source.y,
            width: 0,
            height: 0,
        };
    } else if ("clientLeft" in source && "clientTop" in source) {
        return source.getBoundingClientRect();
    } else {
        return {
            x: (source as MouseEvent).clientX,
            y: (source as MouseEvent).clientY,
            width: 0,
            height: 0,
        };
    }
}
