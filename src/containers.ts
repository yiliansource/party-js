import { settings } from "./settings";
import { Lazy } from "./util/lazy";

/**
 * The prefix to apply to the containers.
 */
const elementPrefix = "party-js-";

/**
 * A utility method to partially update the style of the specified element.
 */
function partialUpdateStyle(
    element: HTMLElement,
    style: Partial<CSSStyleDeclaration>
): void {
    Object.assign(element.style, style);
}

/**
 * Checks if the specified container is 'active', meaning not undefined and attached to the DOM.
 */
function isContainerActive(container: HTMLElement) {
    return container && container.isConnected;
}

/**
 * Returns the root container of the library. Creates it, if it doesn't exist yet.
 */
function createRootContainer(): HTMLElement {
    const container = document.createElement("div");
    container.id = elementPrefix + "container";
    // Style the container to stretch across the full screen, without being interactable
    // by the user. Also apply the z-index from the global settings.
    partialUpdateStyle(container, {
        position: "fixed",
        left: "0",
        top: "0",
        bottom: "0",
        right: "0",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: settings.zIndex.toString(),
    });
    document.body.appendChild(container);

    return container;
}

/**
 * Returns the debugging container of the library. Creates it, if it doesn't exist yet.
 */
function createDebugContainer(): HTMLElement {
    const container = document.createElement("div");
    container.id = elementPrefix + "debug";
    // Style the container in a non-prominent, simplistic, yet clean way, in the top-left corner.
    partialUpdateStyle(container, {
        position: "absolute",
        top: "0",
        left: "0",
        margin: "0.5em",
        padding: "0.5em 1em",
        border: "2px solid rgb(0, 0, 0, 0.2)",
        background: "rgb(0, 0, 0, 0.1)",
        color: "#555",
        fontFamily: "monospace",
    });
    rootContainer.current.appendChild(container);

    return container;
}

/**
 * Returns the particles container of the library. Creates it, if it doesn't exist yet.
 */
function createParticleContainer(): HTMLElement {
    const container = document.createElement("div");
    container.id = elementPrefix + "particles";
    // Style the container to stretch the full parent width, and apply a perspective distortion.
    partialUpdateStyle(container, {
        width: "100%",
        height: "100%",
        perspective: "100vw",
    });
    rootContainer.current.appendChild(container);

    return container;
}

export const rootContainer: Lazy<HTMLElement> = new Lazy<HTMLElement>(
    createRootContainer,
    isContainerActive
);
export const debugContainer: Lazy<HTMLElement> = new Lazy<HTMLElement>(
    createDebugContainer,
    isContainerActive
);
export const particleContainer: Lazy<HTMLElement> = new Lazy<HTMLElement>(
    createParticleContainer,
    isContainerActive
);
