import Vector from "../components/vector";

export class Particle {
    public location: Vector;
    public velocity: Vector;
    public lifetime: number;

    public isDead(): boolean {
        return this.lifetime <= 0;
    }
}
