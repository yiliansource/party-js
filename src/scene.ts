import Entity from "./entity";

class Scene {
    get containerElement(): HTMLElement {
        return this.container;
    }
    get entityCount(): number {
        return this.entities.length;
    }

    constructor() {
    }

    private entities: Entity[] = [];
    private lastTick: number = 0;

    private container: HTMLDivElement;

    init() {
        if (this.container) {
            return;
        }

        this.container = document.createElement("div");
        this.container.id = "party-js-scene";
        this.container.style.position = "fixed";
        this.container.style.top = this.container.style.left = "0";
        this.container.style.width = this.container.style.height = "100%";
        this.container.style.zIndex = "99999";
        this.container.style.pointerEvents = "none";
        this.container.style.perspective = "400px";
        this.container.style.overflow = "visible";

        if (document.body) {
            document.body.appendChild(this.container);
        }
        else {
            window.addEventListener("load", () => document.body.appendChild(this.container));
        }

        window.requestAnimationFrame(this.tick.bind(this));
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    tick(timestamp: number) {
        if (!this.container.parentElement) {
            this.entities = [];
            this.container = undefined;

            return;
        }

        const delta = (timestamp - this.lastTick) / 1000;

        const despawnY = -Math.max(document.documentElement.offsetHeight, window.innerHeight);
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];

            entity.tick(delta);

            if (entity.transform.position.y <= despawnY) {
                entity.destroy();
                this.entities.splice(i--, 1);
            }
        }

        this.lastTick = timestamp;
        window.requestAnimationFrame(this.tick.bind(this));
    }
}
export default new Scene();