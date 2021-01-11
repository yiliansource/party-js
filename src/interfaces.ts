export interface IEntity {}

export interface IDrawable extends IEntity {
    draw(context: CanvasRenderingContext2D): void;
}

export interface ITickable extends IEntity {
    tick(delta: number): void;
}

export interface IDestructable extends ITickable, IEntity {
    shouldDestroy(): boolean;
}