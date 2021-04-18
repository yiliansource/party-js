import { Debug } from "./debug";
import { Emitter, EmitterConstructionOptions } from "./particles/emitter";
import { Renderer } from "./renderer";

/**
 * Represents a scene that contains emitters and their particles.
 *
 * Scenes are responsible for spawning and updating emitters, and
 * removing them once they are done.
 *
 * Scenes are not explicitely present in the DOM as an element, only
 * the contained particles are.
 */
export class Scene {
    /**
     * The emitters currently present in the scene.
     */
    public emitters: Emitter[] = [];

    /**
     * The debug instance associated with the scene.
     */
    public readonly debug = new Debug(this);
    /**
     * The renderer associated with the scene.
     */
    public readonly renderer = new Renderer();

    /**
     * The ID of the currently scheduled tick.
     */
    private scheduledTickId?: number = undefined;
    /**
     * The timestamp of the last tick, used to calculate deltas.
     */
    private lastTickTimestamp = 0;

    /**
     * Initializes a new scene and starts the ticking job.
     */
    constructor() {
        // Ensure the scene context is preserved on the tick.
        this.tick = this.tick.bind(this);
        this.scheduleTick();
    }

    /**
     * Creates and returns a new, default emitter object.
     */
    public createEmitter(options?: EmitterConstructionOptions): Emitter {
        const emitter = new Emitter(options);
        this.emitters.push(emitter);
        return emitter;
    }

    /**
     * Schedules a tick in the scene.
     */
    public scheduleTick(): void {
        this.scheduledTickId = window.requestAnimationFrame(this.tick);
    }
    /**
     * Cancels a pending tick operation.
     */
    public cancelTick(): void {
        window.cancelAnimationFrame(this.scheduledTickId);
    }

    /**
     * Processes a tick cycle, updating all emitters contained in the scene.
     * This is handled as a JS animation frame event, hence the passed timestamp.
     *
     * @remarks
     * The emitter ticking and particle rendering is run using try-catch blocks,
     * to ensure that we can recover from potential errors.
     *
     * @param timestamp The current timestamp of the animation frame.
     */
    private tick(timestamp: number): void {
        // Calculate the elapsed delta and convert it to seconds.
        const delta = (timestamp - this.lastTickTimestamp) / 1000;

        try {
            // Perform ticks for all the emitters in the scene.
            for (let i = 0; i < this.emitters.length; i++) {
                const emitter = this.emitters[i];

                emitter.tick(delta);
                if (emitter.isExpired) {
                    this.emitters.splice(i--, 1);
                }
            }
        } catch (error) {
            console.error(
                `An error occurred while updating the scene's emitters:\n"${error}"`
            );
        }

        try {
            // Instruct the renderer to draw the particles of all systems.
            this.renderer.begin();
            for (const emitter of this.emitters) {
                for (const particle of emitter.particles) {
                    this.renderer.renderParticle(particle, emitter);
                }
            }
            this.renderer.end();
        } catch (error) {
            console.error(
                `An error occurred while rendering the scene's particles:\n"${error}"`
            );
        }

        // Perform a tick on the debug interface
        this.debug.tick(delta);

        // Save the timestamp as the last tick timestamp and schedule a new tick.
        this.lastTickTimestamp = timestamp;
        this.scheduleTick();
    }
}
