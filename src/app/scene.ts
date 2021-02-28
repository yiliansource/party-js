import { Debug } from "./debug";
import { ParticleSystem } from "./particles/particleSystem";
import { Renderer } from "./renderer";

export class Scene {
    public particleSystems: Array<ParticleSystem> = [];

    public readonly debug = new Debug(this);
    public readonly renderer = new Renderer();

    private tickId = -1;
    private lastTick = 0;

    constructor() {
        this.tick = this.tick.bind(this);
        this.scheduleTick();
    }

    public createParticleSystem(): ParticleSystem {
        const system = new ParticleSystem();
        this.particleSystems.push(system);
        return system;
    }

    public scheduleTick(): void {
        this.tickId = window.requestAnimationFrame(this.tick);
    }
    public cancelTick(): void {
        window.cancelAnimationFrame(this.tickId);
    }

    private tick(timestamp: number): void {
        const delta = (timestamp - this.lastTick) / 1000;

        this.debug.tick(delta);
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            const system = this.particleSystems[i];

            system.tick(delta);
            if (system.isExpired) {
                this.particleSystems.splice(i, 1);
            }
        }

        this.renderer.begin();
        for (const system of this.particleSystems) {
            for (const particle of system.particles) {
                this.renderer.renderParticle(particle);
            }
        }
        this.renderer.end();

        this.lastTick = timestamp;
        this.tickId = window.requestAnimationFrame(this.tick);
    }
}
