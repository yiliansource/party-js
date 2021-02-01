import Vector from "./vector";

export default class Transform {
    public position: Vector;
    public rotation: Vector;
    public scale: Vector;

    constructor(position?: Vector, rotation?: Vector, scale?: Vector) {
        this.position = position || Vector.zero;
        this.rotation = rotation || Vector.zero;
        this.scale = scale || Vector.zero;
    }
}