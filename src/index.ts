import { Scene } from "./scene";

// The library requires the use of the DOM, hence it cannot run in non-browser environments.
if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error(
        "It seems like you are trying to run party.js in a non-browser environment, which is not supported."
    );
}

// Export the configurable settings object.
export { settings } from "./settings";

// Export the emitter and particle types.
export * from "./particles/particle";
export * from "./particles/emitter";

// Export various utilities and objects.
export * as variation from "./systems/variation";
export * as modifier from "./systems/modifiers";
export * as modules from "./particles/modules";
export * as random from "./systems/random";
export * as math from "./systems/math";
export * as util from "./util";
export * from "./components";

// Export templates to quickly & easily create sample systems.
export * from "./templates";

// Export shapes so new ones can be registered easily.
export * from "./shapes";

// Export and create the main scene.
export const scene = new Scene();
