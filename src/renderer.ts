import { Vector } from "./components/vector";
import { getParticleContainer } from "./containers";
import { Emitter } from "./particles/emitter";
import { ElementFactory, RendererOptions } from "./particles/options";
import { Particle } from "./particles/particle";
import { deg2rad } from "./systems/math";
import { eulerToAxis } from "./util/rotation";

/**
 * Represents a renderer used to draw particles to the DOM via HTML
 * elements. Additionally, it is responsible for purging the elements
 * of destroyed particles from the DOM.
 */
export class Renderer {
    /**
     * The lookup of elements currently handled by the renderer, with the
     * particle ID as key and a HTMLElement as the value.
     */
    public elements: Map<symbol, HTMLElement> = new Map();
    /**
     * The normalized direction the light comes from.
     */
    public light: Vector = new Vector(0, 0, 1);

    /**
     * The collection of symbols containing the particles that were rendered this frame.
     * This is, for example, used to delete unused particles from the DOM.
     */
    private renderedParticles: Array<symbol>;

    /**
     * Begins a new render block.
     */
    public begin(): void {
        this.renderedParticles = [];
    }
    /**
     * Terminates an existing render block. This checks which particles were rendered
     * during the block and purges all unused HTMLElements from the DOM.
     *
     * @returns The amount of particles that were rendered.
     */
    public end(): number {
        const it = this.elements.keys();

        let result = it.next();
        while (!result.done) {
            const id = result.value as symbol;
            if (!this.renderedParticles.includes(id)) {
                this.elements.get(id).remove();
                this.elements.delete(id);
            }
            result = it.next();
        }

        return this.renderedParticles.length;
    }

    /**
     * Renders an individual particle to the DOM. If the particle is rendered for the first
     * time, a HTMLElement will be created using the emitter's render settings.
     *
     * @param particle The particle to be rendered.
     * @param emitter The system containing the particle.
     */
    public renderParticle(particle: Particle, emitter: Emitter): void {
        const options: RendererOptions = emitter.renderer;

        if (!this.elements.has(particle.id)) {
            // If the HTMLElement for the given particle does not exist yet, create one using
            // the factory of the render options. This either means executing the factory
            // function, or cloning a template HTMLElement.
            const factory: ElementFactory = options.factory;
            const element =
                typeof factory === "function"
                    ? factory()
                    : (factory.cloneNode(true) as HTMLElement);

            const container = getParticleContainer();
            // Register the new element in the map, while appending the new element to the DOM.
            this.elements.set(particle.id, container.appendChild(element));
        }

        const element = this.elements.get(particle.id);

        if (options.applyColour) {
            // If the options offer a colouring method, apply it.
            options.applyColour(particle.colour, element);
        }

        if (options.applyLighting) {
            // If the options offer a lighting method, apply it.
            // Lighting is calculated as a combination of the particle's normal
            // direction and the lighting direction.

            // TODO: Is this really the correct way to get the normal?
            const normal = eulerToAxis(particle.rotation.scale(deg2rad)).axis;
            const lightingCoefficient = normal.dot(Vector.forward);

            options.applyLighting(lightingCoefficient, element);
        }

        if (options.applyTransform) {
            // If the options offer a transformation method, apply it.
            // This ensures the particle is rendered at the correct position with the correct rotation.
            options.applyTransform(particle, element);
        }

        // Mark the particle as rendered.
        this.renderedParticles.push(particle.id);
    }
}
