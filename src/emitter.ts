import Entity from "./entity";
import { ParticleOptions, defaultParticleOptions } from "./particle";
import particleFactory from "./particleFactory";
import { random } from "./util/random";

export type EmitterOptions = Partial<Pick<Emitter, 
    "duration" | "loop" | "autoStart" | "rate" | "bursts" | "particleSettings">>;

export type EmissionBurstOptions = Partial<Omit<EmissionBurst, "attempted">>;
export type EmissionBurst = {
    time: number;
    count: number;
    probability: number;
    attempted: boolean;
}

export default class Emitter extends Entity {
    public duration: number;
    public loop: boolean;
    public autoStart: boolean;
    public rate: number;
    public bursts: EmissionBurst[];
    public particleSettings: ParticleOptions;

    private get spawnInterval() {
        return 1 / this.rate;
    }

    constructor(options: EmitterOptions) {
        super();

        this.duration = options.duration || 1;
        this.loop = options.loop != undefined ? options.loop : true;
        this.autoStart = options.autoStart != undefined ? options.autoStart : true;
        this.rate = options.rate || 0;
        this.bursts = (options.bursts || []).map(burstOption => ({
            time: burstOption.time || 0,
            count: burstOption.count || 0,
            probability: burstOption.probability || 1,
            attempted: false
        }));
        this.particleSettings = options.particleSettings || defaultParticleOptions;

        if (this.autoStart) {
            this.isRunning = true;
        }
    }

    private isRunning: boolean = false;
    private emissionTimer: number = 0;
    private durationTimer: number = 0;

    public tick(delta: number) {
        if (!this.isRunning) {
            return;
        }

        this.emissionTimer += delta;
        this.durationTimer += delta;

        if (this.rate > 0) {
            if (this.emissionTimer >= this.spawnInterval) {
                for (let i = 0; i < this.emissionTimer / this.spawnInterval; i++) {
                    this.spawnParticle();
                    this.emissionTimer = 0;
                }
            }
        }

        if (this.bursts.length > 0) {
            for (let burst of this.bursts) {
                if (!burst.attempted) {
                    if (this.durationTimer >= burst.time) {
                        if (random() <= burst.probability) {
                            for (let i = 0; i < burst.count; i++) {
                                this.spawnParticle();
                            }
                        }
                        burst.attempted = true;
                    }
                }
            }
        }

        if (this.durationTimer >= this.duration) {
            this.durationTimer = 0;
            this.bursts.forEach(b => b.attempted = false);
        }
    }
    public start() {
        this.isRunning = true;
    }
    public stop() {
        this.isRunning = false;
        this.emissionTimer = this.durationTimer = 0;
    }

    private spawnParticle() {
        particleFactory.createParticle(this.particleSettings);
    }
}