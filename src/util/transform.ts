import Matrix from "./matrix";
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

    public transformPoint(point: Vector): Vector {
        point = point.scale(this.scale);

        const rotationMatrix = Matrix.rotation(this.rotation);
        const pointMatrix = new Matrix([point.x], [point.y], [point.z]);

        point = new Vector(...rotationMatrix.mul(pointMatrix).col(0));

        return this.position.add(point);
    }
}