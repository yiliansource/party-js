import Particle, { ParticleOptions } from "./particle";
import Colour from "./util/colour";
import Vector from "./util/vector";

class ParticleFactory {
    createParticle(options: ParticleOptions): Particle {
        return new Particle(options);
    }
}
export default new ParticleFactory();