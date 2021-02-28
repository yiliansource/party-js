import { Vector } from "../components/vector";
import { deg2rad } from "../systems/math";
import { eulerToAxis } from "../util/rotation";
import { containers } from "./containers";
import { Particle } from "./particles/particle";

export class Renderer {
    public elements: Map<symbol, HTMLElement> = new Map();
    public light: Vector = new Vector(0, 0, 1);

    private renderedParticles: Array<symbol>;

    public begin(): void {
        this.renderedParticles = [];
    }
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

    public renderParticle(particle: Particle): void {
        if (!this.elements.has(particle.id)) {
            const element = document.createElement("div");
            element.style.position = "absolute";
            element.style.width = element.style.height = "10px";

            this.elements.set(
                particle.id,
                containers.particleContainer.appendChild(element)
            );
        }

        const element = this.elements.get(particle.id);
        const rotation = eulerToAxis(particle.rotation.scale(deg2rad));

        const lightingCoefficient = rotation.axis.dot(Vector.forward);
        element.style.background = particle.colour.toHex();
        element.style.filter = `brightness(${
            0.5 + Math.abs(lightingCoefficient) * 0.5
        })`;

        element.style.transform =
            `translateX(${particle.location.x.toFixed(3)}px) ` +
            `translateY(${particle.location.y.toFixed(3)}px) ` +
            `rotate3d(${rotation.axis.xyz.join(", ")}, ` +
            `${rotation.angle.toFixed(3)}rad)` +
            `scale(${particle.size.toFixed(3)})`;

        this.renderedParticles.push(particle.id);
    }
}
