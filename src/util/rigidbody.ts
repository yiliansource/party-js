import { ITickable } from "../interfaces";
import { gravity } from "./constants";
import Transform from "./transform";
import Vector from "./vector";

export default class Rigidbody implements ITickable {
    public velocity: Vector;
    public angularVelocity: Vector;

    public useGravity: boolean = true;

    constructor(transform: Transform, initialVelocity?: Vector, angularVelocity?: Vector) {
        this.transform = transform;
        this.velocity = initialVelocity || Vector.zero;
        this.angularVelocity = angularVelocity || Vector.zero;
    }

    private readonly transform: Transform;
    
    public tick(delta: number) {
        this.velocity = this.velocity.add(Vector.up.scale(gravity * delta));

        this.transform.position = this.transform.position.add(this.velocity.scale(delta));
        this.transform.rotation = this.transform.rotation.add(this.angularVelocity.scale(delta));
    }
}