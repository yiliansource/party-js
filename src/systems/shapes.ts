import { Variation, evaluateVariation } from "./variation";

/**
 * Represents the lookup that maps resolveable element keys to their HTML strings.
 *
 * @remarks
 * The default shapes are made to fit inside a dimension of 10x10 pixels, except
 * the 'star' shape, which exceeds it slightly.
 */
export const resolvableShapes: Record<string, string> = {
    square: `<div style="height: 10px; width: 10px;"></div>`,
    rectangle: `<div style="height: 6px; width: 10px;"></div>`,
    circle: `<svg viewBox="0 0 2 2" width="10" height="10"><circle cx="1" cy="1" r="1" fill="currentColor"/></svg>`,
    roundedSquare: `<div style="height: 10px; width: 10px; border-radius: 3px;"></div>`,
    roundedRectangle: `<div style="height: 6px; width: 10px; border-radius: 3px;"></div>`,
    star: `<svg viewBox="0 0 512 512" width="15" height="15"><polygon fill="currentColor" points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/></svg>`,
};

/**
 * Resolves the specified element factory using the resolvable elements, if needed.
 */
export function resolveShapeFactory(
    factory: Variation<string | HTMLElement>
): HTMLElement {
    // Retrieve the unresolved element from the factory.
    const shape = evaluateVariation(factory);
    // If a string is returned, we need to resolve the element. This means
    // looking up the string in the resolver lookup. If the key was not
    // resolvable, we throw an error.
    if (typeof shape === "string") {
        const resolved = resolvableShapes[shape];
        if (!resolved) {
            throw new Error(
                `Failed to resolve shape key '${shape}'. Did you forget to add it to the 'resolvableShapes' lookup?`
            );
        }
        // We're in luck, we can resolve the element! We create a dummy <div> element
        // to set the innerHTML of, and return the first element child.
        const dummy = document.createElement("div");
        dummy.innerHTML = resolved;
        return dummy.firstElementChild as HTMLElement;
    }
    return shape;
}
