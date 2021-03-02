import { settings } from ".";

/**
 * The prefix to apply to the containers.
 */
const elementPrefix = "party-js-";

// Internal container variables. These should not be directly used outside of this module.
// When requesting a container, these variables are checked first, and if they dont exist
// or are detached from the DOM, they will be created.
let __rootContainer: HTMLElement;
let __debugContainer: HTMLElement;
let __particleContainer: HTMLElement;

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
export function getRootContainer(): HTMLElement {
    if (!isContainerActive(__rootContainer)) {
        __rootContainer = document.createElement("div");
        __rootContainer.id = elementPrefix + "container";
        // Style the container to stretch across the full screen, without being interactable
        // by the user. Also apply the z-index from the global settings.
        partialUpdateStyle(__rootContainer, {
            position: "fixed",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: settings.zIndex.toString(),
        });
        document.body.appendChild(__rootContainer);
    }

    return __rootContainer;
}

/**
 * Returns the debugging container of the library. Creates it, if it doesn't exist yet.
 */
export function getDebugContainer(): HTMLElement {
    if (!isContainerActive(__debugContainer)) {
        __debugContainer = document.createElement("div");
        __debugContainer.id = elementPrefix + "debug";
        // Style the container in a non-prominent, simplistic, yet clean way in the top-left corner.
        partialUpdateStyle(__debugContainer, {
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
        getRootContainer().appendChild(__debugContainer);
    }

    return __debugContainer;
}

/**
 * Returns the particles container of the library. Creates it, if it doesn't exist yet.
 */
export function getParticleContainer(): HTMLElement {
    if (!isContainerActive(__particleContainer)) {
        __particleContainer = document.createElement("div");
        __particleContainer.id = elementPrefix + "particles";
        // Style the container to stretch the full parent width, and apply a perspective distortion.
        partialUpdateStyle(__particleContainer, {
            width: "100%",
            height: "100%",
            perspective: "400px",
        });
        getRootContainer().appendChild(__particleContainer);
    }

    return __particleContainer;
}
