import Emitter from './emitter';
import Scene from './scene';

export { range, variation } from './util/customization';
export { default as Emitter } from './emitter';
export { default as Particle } from './particle';

Scene.initialize();

// Just for testing
Scene.addEntity(new Emitter());