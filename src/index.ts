import * as components from "./components";
import { Emitter } from "./particles/emitter";
import * as modules from "./particles/modules";
import { Particle } from "./particles/particle";
import { Scene } from "./scene";
import { settings } from "./settings";
import * as shapes from "./shapes";
import * as math from "./systems/math";
import * as modifier from "./systems/modifiers";
import * as random from "./systems/random";
import * as variation from "./systems/variation";
import * as templates from "./templates";
import * as util from "./util";

// Create the lazy-initializing scene.
const scene = new util.Lazy<Scene>(() => {
    // The library requires the use of the DOM, hence it cannot run in non-browser environments.
    if (typeof document === "undefined" || typeof window === "undefined") {
        throw new Error(
            "It seems like you are trying to run party.js in a non-browser environment, which is not supported."
        );
    }
    return new Scene();
});

const party = {
    // Export utility components at top level.
    ...components,
    // Export templates to quickly & easily create sample systems.
    ...templates,
    // Export shapes so new ones can be registered easily.
    ...shapes,

    // Export the scene and the global settings.
    scene,
    settings,

    // Export the emitter and particle types.
    Particle,
    Emitter,

    // Export various utilities and objects.
    variation,
    modifier,
    modules,
    random,
    math,
    util,

    /**
     * Forces the initialization of the otherwise lazy scene.
     */
    forceInitialize(): void {
        scene.current;
    },
};

export default party;
