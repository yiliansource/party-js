
export default class Renderer {
    constructor() {
        if (!document) {
            throw new Error('Could not spawn renderer, no document element exists.');
        }

        this.canvas = document.createElement("canvas");
        this.canvas.id = 'party-js-canvas';

        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = this.canvas.style.top = '0';
        this.canvas.style.width = this.canvas.style.height = '100%';

        this.context = this.canvas.getContext('2d');

        window.addEventListener("load", () => document.body.appendChild(this.canvas));
    }

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    prepare() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}