import Entity from "../entity";
import scene from "../scene";
import Vector from "../util/vector";
import Shape from "./shape";

export default class ShapeRenderer {
    public useLighting: boolean = true;

    constructor(shape: Shape, entity: Entity) {
        this.entity = entity;

        this.html = shape.toHtml();
        this.html.style.position = "absolute";

        scene.containerElement.appendChild(this.html);
    }

    private readonly html: HTMLElement;
    private readonly entity: Entity;

    public render() {
        const t = this.entity.transform;

        this.html.style.left = t.position.x + "px";
        this.html.style.top = -t.position.y + "px";
        this.html.style.transform = `scale3d(${t.scale.xyz.join(', ')}) translateZ(${-t.position.z}px) rotateX(${t.rotation.x}rad) rotateY(${t.rotation.y}rad) rotateZ(${t.rotation.z}rad)`;

        this.html.style.filter = this.useLighting
            ? `brightness(${this.calculateLighting(Vector.fromLookAngles(t.rotation)).toFixed(3)})`
            : "";
    }
    public destroy() {
        this.html.remove();
    }

    private calculateLighting(normal: Vector) {
        return 0.5 + 0.5 * Math.abs(normal.dot(new Vector(0, 0, 1)));
    }
}