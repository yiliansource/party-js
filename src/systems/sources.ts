import { Circle, Rect, Vector } from "../components";
import { randomInsideCircle, randomInsideRect } from "./random";

/**
 * Represents a method used for sampling points to emit particles from.
 */
export type SourceSampler = () => Vector;
/**
 * Represents all types where a source type can be dynamically inferred.
 */
export type DynamicSourceType = Circle | Rect | HTMLElement | MouseEvent;

/**
 * Dynamically infers a source sampler for the specified source type.
 */
export function dynamicSource(source: DynamicSourceType): SourceSampler {
    if ("radius" in source) {
        return circleSource(source);
    }
    if ("width" in source) {
        return rectSource(source);
    }
    if ("getBoundingClientRect" in source) {
        return elementSource(source);
    }
    if ("clientX" in source) {
        return mouseSource(source);
    }

    throw new Error(`Cannot infer the source type of '${source}'.`);
}

/**
 * Creates a sampler to retrieve random points inside a specified circle.
 */
export function circleSource(source: Circle): SourceSampler {
    return () => randomInsideCircle(source);
}
/**
 * Creates a sampler to retrieve random points inside a specified rectangle.
 */
export function rectSource(source: Rect): SourceSampler {
    return () => randomInsideRect(source);
}
/**
 * Creates a sampler to retrieve random points inside a specified HTMLElement.
 */
export function elementSource(source: HTMLElement): SourceSampler {
    return () => randomInsideRect(source.getBoundingClientRect());
}
/**
 * Creates a sampler to retrieve the position of a mouse event.
 */
export function mouseSource(source: MouseEvent): SourceSampler {
    return () => new Vector(source.clientX, source.clientY);
}
