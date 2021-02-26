class DomContainer {
    public rootContainer: HTMLElement;
    public debugContainer: HTMLElement;
    public particleContainer: HTMLElement;

    constructor() {
        this.rootContainer = document.createElement("div");
        this.rootContainer.style.position = "fixed";
        this.rootContainer.style.left = this.rootContainer.style.top = "0";
        this.rootContainer.style.bottom = this.rootContainer.style.right = "0";
        document.body.appendChild(this.rootContainer);

        this.debugContainer = document.createElement("div");
        this.debugContainer.style.position = "absolute";
        this.debugContainer.style.right = "0";
        this.debugContainer.style.padding = "0.5em";
        this.debugContainer.style.fontFamily = "monospace";
        this.rootContainer.appendChild(this.debugContainer);
    }
}
export const containers = new DomContainer();
