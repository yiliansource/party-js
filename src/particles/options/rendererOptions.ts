import { Colour } from "../../components/colour";
import { deg2rad } from "../../systems/math";
import { eulerToAxis } from "../../util/rotation";
import { Particle } from "../particle";

/**
 * Represents a factory method, used to provide the renderer with a way to
 * create particles inside of the DOM. In case of an HTMLElement, the existing element
 * is deep-cloned, otherwise the function is evaluated.
 */
export type ElementFactory = HTMLElement | (() => HTMLElement);
/**
 * Represents a delegate used by the renderer to apply a certain property to the
 * particle's HTMLElement. Note that this property is generic and does not
 * have to contain the particle itself.
 */
export type ApplyFunction<T> = (property: T, element: HTMLElement) => void;

/**
 * Holds the options used to configure the renderer for a particle system.
 */
export interface RendererOptions {
    /**
     * The factory used to create the HTMLElement for a particle.
     * @defaultValue Creates a square-shaped <div> element with size 10px.
     */
    factory: ElementFactory;

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
export function getDefaultRendererOptions(): RendererOptions {
    return {
        factory: function (): HTMLElement {
            const element = document.createElement("div");
            Object.assign(element.style, <Partial<CSSStyleDeclaration>>{
                position: "absolute",
                width: "10px",
                height: "10px",
            });
            return element;
        },

        applyColour: defaultApplyColour,
        applyLighting: defaultApplyLighting,
        applyTransform: defaultApplyTransform,
    };
}

/**
 * Applies the specified colour to the element's 'background'.
 */
function defaultApplyColour(colour: Colour, element: HTMLElement): void {
    element.style.background = colour.toHex();
}
/**
 * Applies the specified lighting to the element as a brightness filter.
 */
function defaultApplyLighting(lighting: number, element: HTMLElement): void {
    element.style.filter = `brightness(${0.5 + Math.abs(lighting) * 0.5})`;
}
/**
 * Applies the specified transform to the element as a 3D CSS transform.
 */
function defaultApplyTransform(particle: Particle, element: HTMLElement): void {
    const rotation = eulerToAxis(particle.rotation.scale(deg2rad));
    element.style.transform =
        `translateX(${particle.location.x.toFixed(3)}px) ` +
        `translateY(${particle.location.y.toFixed(3)}px) ` +
        `rotate3d(${rotation.axis.xyz.join(", ")}, ` +
        `${rotation.angle.toFixed(3)}rad) ` +
        `scale(${particle.size.toFixed(3)})`;
}
