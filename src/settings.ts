/**
 * Represents global settings used throughout the library.
 */
export interface Settings {
    /**
     * Whether the debugging mode should be enabled.
     *
     * @defaultValue false
     */
    debug: boolean;
    /**
     * The amount of gravity to apply to particles in the scene, in pixels.
     * Note that this value is positive by default, since the y-axis increases
     * downwards in a DOM.
     *
     * @defaultValue 800
     */
    gravity: number;
    /**
     * The z-index to place the DOM containers at.
     *
     * @defaultValue 99999
     */
    zIndex: number;
}

export const settings: Settings = {
    debug: false,
    gravity: 800,
    zIndex: 99999,
};
