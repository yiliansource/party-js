class DomContainer {
    public rootContainer: HTMLElement;
    public debugContainer: HTMLElement;
    public particleContainer: HTMLElement;

    private readonly elementPrefix = "party-js-";

    constructor() {
        this.rootContainer = document.createElement("div");
        this.rootContainer.id = this.elementPrefix + "container";
        document.body.appendChild(this.rootContainer);
        this.setPartialStyle(this.rootContainer, {
            position: "fixed",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            pointerEvents: "none",
            zIndex: "99999",
        });

        this.debugContainer = document.createElement("div");
        this.debugContainer.id = this.elementPrefix + "debug";
        this.rootContainer.appendChild(this.debugContainer);
        this.setPartialStyle(this.debugContainer, {
            position: "absolute",
            top: "0",
            left: "0",
            margin: "0.5em",
            padding: "0.5em 1em",
            border: "2px solid rgb(0, 0, 0, 0.2)",
            background: "rgb(0, 0, 0, 0.1)",
            color: "#555",
            fontFamily: "monospace",
        });

        this.particleContainer = document.createElement("div");
        this.particleContainer.id = this.elementPrefix + "particles";
        this.rootContainer.appendChild(this.particleContainer);
        this.setPartialStyle(this.particleContainer, {
            width: "100%",
            height: "100%",
            perspective: "400px",
        });
    }

    private setPartialStyle(
        element: HTMLElement,
        style: Partial<CSSStyleDeclaration>
    ): void {
        Object.assign(element.style, style);
    }
}
export const containers = new DomContainer();
