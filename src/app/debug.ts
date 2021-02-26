import { containers } from "./domContainer";
import { Scene } from "./scene";

export class Debug {
    public get enabled(): boolean {
        return this.isEnabled;
    }
    public set enabled(enabled: boolean) {
        this.debugContainer.style.display = enabled ? "block" : "none";
        this.isEnabled = enabled;
    }

    private get debugContainer(): HTMLElement {
        return containers.debugContainer;
    }

    private isEnabled = false;

    constructor(private scene: Scene) {}

    public tick(delta: number): void {
        if (!this.enabled) {
            return;
        }

        this.debugContainer.innerHTML = [
            `FPS: ${(1 / delta).toFixed(0)}`,
            `Systems: ${this.scene.particleSystems.length}`,
            `Particles: ${this.scene.particleSystems.reduce(
                (acc, cur) => acc + cur.particles.length,
                0
            )}`,
        ].join("<br>");
    }
}
