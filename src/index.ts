import Emitter, { EmitterOptions } from './emitter';
import Scene from './scene';

export const init = () => Scene.init();

export { range, variation } from './util/customization';
export { default as Emitter } from './emitter';
export { default as Particle } from './particle';

export function createEmitter(options: EmitterOptions) {
    let emitter = new Emitter(options);
    Scene.addEntity(emitter);
    return emitter;
}

Scene.init();