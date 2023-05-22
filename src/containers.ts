import { settings } from "./settings";
import { Lazy } from "./util";

/**
 * The prefix to apply to the containers.
 */
const containerPrefix = "party-js-";

/**
 * Checks if the specified container is 'active', meaning not undefined and attached to the DOM.
 */
function isContainerActive(container: HTMLElement): boolean {
    return container && container.isConnected;
}

/**
 * A generic factory method for creating a DOM container. Prefixes the specified name with the
 * container prefix, applies the styles and adds it under the parent.
 */
function makeContainer(
    name: string,
    styles: Partial<CSSStyleDeclaration>,
    parent: HTMLElement
): HTMLElement {
    const container = document.createElement("div");
    container.id = containerPrefix + name;
    Object.assign(container.style, { ...styles, direction: "ltr" });
    return parent.appendChild(container);
}

/**
 * Represents the root container for DOM elements of the library.
 */
export const rootContainer = new Lazy<HTMLElement>(
    () =>
        makeContainer(
            "container",
            {
                position: "fixed",
                left: "0",
                top: "0",
                height: "100vh",
                width: "100vw",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: settings.zIndex.toString(),
            },
            document.body
        ),
    isContainerActive
);
/**
 * Represents the debugging container of the library, only active if debugging is enabled.
 */
export const debugContainer = new Lazy<HTMLElement>(
    () =>
        makeContainer(
            "debug",
            {
                position: "absolute",
                top: "0",
                left: "0",
                margin: "0.5em",
                padding: "0.5em 1em",
                border: "2px solid rgb(0, 0, 0, 0.2)",
                background: "rgb(0, 0, 0, 0.1)",
                color: "#555",
                fontFamily: "monospace",
            },
            rootContainer.current
        ),
    isContainerActive
);
/**
 * Represents the particle container of the library.
 * This is where the particle DOM elements get rendered into.
 */
export const particleContainer = new Lazy<HTMLElement>(
    () =>
        makeContainer(
            "particles",
            {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                perspective: "1200px",
            },
            rootContainer.current
        ),
    isContainerActive
);
