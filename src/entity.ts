import Transform from "./util/transform";

export default class Entity {
    transform: Transform;
    lifetime: number;

    constructor() {
        this.transform = new Transform();
    }
    
    tick(delta: number): void {
        this.lifetime += delta;
    }
    
    destroy(): void {}
}