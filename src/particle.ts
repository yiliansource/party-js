import Entity from "./entity";
import Shape, { RectShape } from "./shapes/shape";
import ShapeRenderer from "./shapes/shapeRenderer";
import Colour from "./util/colour";
import Rigidbody from "./util/rigidbody";
import Transform from "./util/transform";
import Vector from "./util/vector";

export const defaultParticleOptions: ParticleOptions = {
    shape: new RectShape(Vector.one.scale(5), Colour.black)
};
export type ParticleOptions = {
    position?: Vector;
    rotation?: Vector;
    scale?: Vector;
    initialVelocity?: Vector;
    angularVelocity?: Vector;
    shape: Shape;
    colour?: Colour;
    useGravity?: boolean;
    useLighting?: boolean;
}

export default class Particle extends Entity {
    public transform: Transform;
    public rigidbody: Rigidbody;
    public renderer: ShapeRenderer;

    constructor(options: ParticleOptions) {
        super();

        this.transform = new Transform(options.position, options.rotation, options.scale);

        this.rigidbody = new Rigidbody(this.transform, options.initialVelocity, options.angularVelocity);
        this.rigidbody.useGravity = options.useGravity == undefined ? true : options.useGravity;

        this.renderer = new ShapeRenderer(options.shape, this);
        this.renderer.useLighting = options.useLighting == undefined ? true : options.useLighting;
    }

    tick(delta: number) {
        super.tick(delta);
        
        this.rigidbody.tick(delta);
        this.renderer.render();
    }

    destroy() {
        this.renderer.destroy();
    }
}