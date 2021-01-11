import { IDestructable, IDrawable, ITickable } from "./interfaces";
import Colour from "./util/colour";
import Rigidbody from "./util/rigidbody";
import Transform from "./util/transform";
import Vector from "./util/vector";

export interface ParticleOptions {
    position?: Vector;
    rotation?: Vector;
    scale?: Vector;
    initialVelocity?: Vector;
    angularVelocity?: Vector;
    colour?: Colour;
    shape?: string; // TODO
    useGravity?: boolean;
    useLighting?: boolean;
}

export default class Particle implements ITickable, IDrawable, IDestructable {
    public transform: Transform;
    public rigidbody: Rigidbody;
    public colour: Colour;
    public shape: string;

    constructor(options: ParticleOptions) {
        this.transform = new Transform(options.position, options.rotation, options.scale);

        this.rigidbody = new Rigidbody(this.transform, options.initialVelocity, options.angularVelocity);
        this.rigidbody.useGravity = options.useGravity != undefined ? true : options.useGravity;

        this.colour = options.colour || Colour.white;
    }

    tick(delta: number) {
        this.rigidbody.tick(delta);
    }

    shouldDestroy(): boolean {
        return this.transform.position.y <= -Math.max(document.documentElement.offsetHeight, window.innerHeight);
    }
}