import { debugContainer } from "./containers";
import { Scene } from "./scene";
import { settings } from "./settings";

/**
 * Represents a utility module to view debug information inside the DOM.
 * This is disabled by default and needs to manually be enabled by setting
 * the '.enabled' field to true.
 *
 * While disabled, the utility will not fetch stats and update itself.
 */
export class Debug {
    /**
     * The rate at which the debug interface should refresh itself (per second).
     */
    private readonly refreshRate = 8;
    /**
     * The timer counting down to refreshes.
     */
    private refreshTimer = 1 / this.refreshRate;

    /**
     * Registers a new debug utility that is attached to the given scene.
     *
     * @param scene The scene to attach to.
     */
    constructor(private scene: Scene) {}

    /**
     * Processes a tick event in the interface. This checks if enough has passed to
     * trigger a refresh, and if so, fetches the debug information and updates the DOM.
     *
     * @param delta The time that has elapsed since the last tick.
     */
    public tick(delta: number): void {
        const container = debugContainer.current;

        // If the current display style does not match the style inferred from the
        // enabled-state, update it.
        const displayStyle = settings.debug ? "block" : "none";
        if (container.style.display !== displayStyle) {
            container.style.display = displayStyle;
        }

        if (!settings.debug) {
            // If the interface is not enabled, don't fetch or update any infos.
            return;
        }

        this.refreshTimer += delta;
        if (this.refreshTimer > 1 / this.refreshRate) {
            this.refreshTimer = 0;
            // Update the container with the fetched information joined on line breaks.
            container.innerHTML = this.getDebugInformation(delta).join("<br>");
        }
    }

    /**
     * Fetches the debug information from the specified delta and the linked scene.
     *
     * @returns An array of debugging information, formatted as HTML.
     */
    private getDebugInformation(delta: number): string[] {
        // Count emitters and particles.
        const emitters = this.scene.emitters.length;
        const particles = this.scene.emitters.reduce(
            (acc, cur) => acc + cur.particles.length,
            0
        );

        const infos: string[] = [
            `<b>party.js Debug</b>`,
            `--------------`,
            `FPS: ${Math.round(1 / delta)}`,
            `Emitters: ${emitters}`,
            `Particles: ${particles}`,
        ];

        // Emitter informations are formatted using their index, internal timer
        // and total particle count.
        const emitterInfos: string[] = this.scene.emitters.map(function (
            emitter,
            index
        ) {
            return (
                `Emitter #${index + 1} (` +
                [
                    `Σp: ${emitter.particles.length}`,
                    `Σt: ${emitter["durationTimer"].toFixed(3)}s`,
                ].join(", ") +
                `)`
            );
        });

        infos.push("--------------", ...emitterInfos);

        return infos;
    }
}
