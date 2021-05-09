import { Vector } from "./components/vector";
import { particleContainer } from "./containers";
import { Emitter } from "./particles/emitter";
import { RenderOptions } from "./particles/options";
import { Particle } from "./particles/particle";
import { resolveShapeFactory } from "./shapes";
import { rotationToNormal } from "./util";

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
    private renderedParticles: symbol[];

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
        const options: RenderOptions = emitter.renderer;

        // Ensure that an element for the particle exists.
        const element = this.elements.has(particle.id)
            ? this.elements.get(particle.id)
            : this.createParticleElement(particle, options);

        if (options.applyColor) {
            // If the options offer a coloring method, apply it.
            options.applyColor(particle.color, element);
        }

        if (options.applyOpacity) {
            // If the options offer an opacity modifying method, apply it.
            options.applyOpacity(particle.opacity, element);
        }

        if (options.applyLighting) {
            // If the options offer a lighting method, apply it.
            // Lighting is calculated as a combination of the particle's normal
            // direction and the lighting direction.
            const normal = rotationToNormal(particle.rotation);
            const lightingCoefficient = normal.dot(this.light);

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

    /**
     * Creates the HTMLElement for a particle that does not have one already.
     */
    private createParticleElement(
        particle: Particle,
        options: RenderOptions
    ): HTMLElement {
        // Resolve the element returned from the factory.
        const resolved = resolveShapeFactory(options.shapeFactory);
        // Clone the node to ensure we do not break existing elements.
        const element = resolved.cloneNode(true) as HTMLElement;

        // Ensure that the elements can be "stacked" ontop of eachother.
        element.style.position = "absolute";

        // Register the new element in the map, while appending the new element to the DOM.
        this.elements.set(
            particle.id,
            particleContainer.current.appendChild(element)
        );

        return element;
    }
}
