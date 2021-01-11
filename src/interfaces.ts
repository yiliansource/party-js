import Transform from "./util/transform";

export interface IEntity {}

export interface IDrawable extends IEntity {
    shape: string;
    transform: Transform;
}

export interface ITickable extends IEntity {
    tick(delta: number): void;
}

export interface IDestructable extends ITickable, IEntity {
    shouldDestroy(): boolean;
}