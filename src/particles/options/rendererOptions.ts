import { Colour } from "../../components/colour";
import { deg2rad } from "../../systems/math";
import { eulerToAxis } from "../../util/rotation";
import { Particle } from "../particle";

export type ElementFactory = HTMLElement | (() => HTMLElement);
export type ApplyFunction<T> = (property: T, element: HTMLElement) => void;

export interface RendererOptions {
    factory: ElementFactory;

    applyColour?: ApplyFunction<Colour>;
    applyLighting?: ApplyFunction<number>;
    applyTransform?: ApplyFunction<Particle>;
}

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

function defaultApplyColour(colour: Colour, element: HTMLElement): void {
    element.style.background = colour.toHex();
}
function defaultApplyLighting(lighting: number, element: HTMLElement): void {
    element.style.filter = `brightness(${0.5 + Math.abs(lighting) * 0.5})`;
}
function defaultApplyTransform(particle: Particle, element: HTMLElement): void {
    const rotation = eulerToAxis(particle.rotation.scale(deg2rad));
    element.style.transform =
        `translateX(${particle.location.x.toFixed(3)}px) ` +
        `translateY(${particle.location.y.toFixed(3)}px) ` +
        `rotate3d(${rotation.axis.xyz.join(", ")}, ` +
        `${rotation.angle.toFixed(3)}rad) ` +
        `scale(${particle.size.toFixed(3)})`;
}
