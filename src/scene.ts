import { IDestructable, IDrawable, IEntity, ITickable } from "./interfaces";
import Renderer from "./renderer";

class Scene {
    constructor() {
        this.renderer = new Renderer();
    }

    private entities: IEntity[];

    private renderer: Renderer;
    private lastTick: number = 0;

    initialize() {
        window.requestAnimationFrame(this.tick.bind(this));
    }

    addEntity(entity: IEntity) {
        this.entities.push(entity);
    }

    tick(timestamp: number) {
        const delta = (timestamp - this.lastTick) / 1000;

        for (let tickable of this.entities.filter(e => "tick" in e)) {
            (tickable as ITickable).tick(delta);
        }

        this.renderer.prepare();
        for (let drawable of this.entities.filter(e => "draw" in e)) {
            this.renderer.render(drawable as IDrawable);
        }

        this.entities = this.entities.filter(tickable => {
            if ("shouldDestroy" in tickable && (tickable as IDestructable).shouldDestroy()) {
                return false;
            }
            return true;
        });

        this.lastTick = timestamp;
        window.requestAnimationFrame(this.tick.bind(this));
    }
}
export default new Scene();