import { ParticleSystem } from "../entities/particleSystem";
import { Debug } from "./debug";

export class Scene {
    public particleSystems: Array<ParticleSystem> = [];
    public readonly debug = new Debug(this);

    private tickId = -1;
    private lastTick = 0;

    constructor() {
        this.particleSystems.push(new ParticleSystem());

        this.tick = this.tick.bind(this);
        this.scheduleTick();
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
        for (const system of this.particleSystems) {
            system.tick(delta);
        }

        this.lastTick = timestamp;
        this.tickId = window.requestAnimationFrame(this.tick);
    }
}
