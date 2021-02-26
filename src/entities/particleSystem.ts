import { Particle } from "./particle";

export class ParticleSystem {
    public readonly particles: Array<Particle> = [];

    constructor() {
        for (let i = 0; i < 10; i++) {
            const particle = new Particle();
            particle.lifetime = i;
            this.particles.push(particle);
        }
    }

    public tick(delta: number): void {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            this.tickParticle(particle, delta);

            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    private tickParticle(particle: Particle, delta: number): void {
        particle.lifetime -= delta;
    }
}
