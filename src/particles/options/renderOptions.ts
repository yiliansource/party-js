import { Colour } from "../../components/colour";
import { Variation } from "../../systems/variation";
import { Particle } from "../particle";

/**
 * Represents a delegate used by the renderer to apply a certain property to the
 * particle's HTMLElement. Note that this property is generic and does not
 * have to contain the particle itself.
 */
export type ApplyFunction<T> = (property: T, element: HTMLElement) => void;

/**
 * Holds the options used to configure the renderer for a particle system.
 */
export interface RenderOptions {
    /**
     * The factory used to determine the element (or "shape") that a particle will be rendered as.
     * This variation can also return a resolve-able string.
     *
     * @remarks
     * Depending on the type of value that is returned from the factory, additional
     * processing has to be done.
     *
     * - strings: The `party.resolvableShapes` lookup is used to resolve the string to an actual
     * HTMLElement, before following the same procedure as if an HTMLElement would have been passed.
     * - HTMLElements: The returned element is deep cloned and used to represent the particle in the document.
     *
     * @defaultValue Creates a square-shaped `<div>` element with a size of 10px.
     */
    shapeFactory: Variation<HTMLElement | string>;

    /**
     * The delegate used to apply a certain colour to the particle's HTMLElement.
     * @defaultValue Applies the specified colour to the element's 'background'.
     */
    applyColour?: ApplyFunction<Colour>;
    /**
     * The delegate used to apply a certain degree of lighting to the particle's HTMLElement.
     * @defaultValue Applies the specified lighting to the element as a brightness filter.
     */
    applyLighting?: ApplyFunction<number>;
    /**
     * The delegate used to apply a certain transform to the particle's HTMLElement.
     * @defaultValue Applies the specified transform to the element as a 3D CSS transform.
     */
    applyTransform?: ApplyFunction<Particle>;
}

/**
 * Returns the default set of renderer options.
 */
export function getDefaultRendererOptions(): RenderOptions {
    return {
        shapeFactory: "square",

        applyColour: defaultApplyColour,
        applyLighting: defaultApplyLighting,
        applyTransform: defaultApplyTransform,
    };
}

/**
 * Applies the specified colour to the element.
 *
 * @remarks
 * This function is aware of the element's node type:
 * - `div` elements have their `background` set.
 * - `svg` elements have their `fill` and `color` set.
 * - Other elements have their `color` set.
 */
function defaultApplyColour(colour: Colour, element: HTMLElement): void {
    const hex = colour.toHex();
    // Note that by default, HTML node names are uppercase.
    switch (element.nodeName.toLowerCase()) {
        case "div":
            element.style.background = hex;
            break;
        case "svg":
            element.style.fill = element.style.color = hex;
            break;
        default:
            element.style.color = hex;
            break;
    }
}
/**
 * Applies the specified lighting to the element as a brightness filter.
 *
 * @remarks
 * This function assumes an ambient light with intensity 0.5, and that the
 * particle should be lit from both sides. The brightness filter can exceed 1,
 * to give the particles a "glossy" feel.
 */
function defaultApplyLighting(lighting: number, element: HTMLElement): void {
    element.style.filter = `brightness(${0.5 + Math.abs(lighting)})`;
}
/**
 * Applies the specified transform to the element as a 3D CSS transform.
 */
function defaultApplyTransform(particle: Particle, element: HTMLElement): void {
    element.style.transform =
        `translateX(${particle.location.x.toFixed(3)}px) ` +
        `translateY(${particle.location.y.toFixed(3)}px) ` +
        `translateZ(${particle.location.z.toFixed(3)}px) ` +
        `rotateX(${particle.rotation.x.toFixed(3)}deg) ` +
        `rotateY(${particle.rotation.y.toFixed(3)}deg) ` +
        `rotateZ(${particle.rotation.z.toFixed(3)}deg) ` +
        `scale(${particle.size.toFixed(3)})`;
}
