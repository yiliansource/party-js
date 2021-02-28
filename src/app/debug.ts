import { containers } from "./containers";
import { Scene } from "./scene";

export class Debug {
    public enabled = false;
    public showSystems = false;

    private readonly refreshRate = 8;
    private refreshTimer = 1 / this.refreshRate;

    constructor(private scene: Scene) {}

    public tick(delta: number): void {
        containers.debugContainer.style.display = this.enabled
            ? "block"
            : "none";

        if (!this.enabled) {
            return;
        }

        this.refreshTimer += delta;
        if (this.refreshTimer > 1 / this.refreshRate) {
            this.refreshTimer = 0;

            containers.debugContainer.innerHTML = this.getDebugInformation(
                delta
            ).join("<br>");
        }
    }

    private getDebugInformation(delta: number): Array<string> {
        const infos: Array<string> = [
            `<b>party.js Debug</b>`,
            `--------------`,
            `FPS: ${(1 / delta).toFixed(0)}`,
            `Systems: ${this.scene.particleSystems.length}`,
            `Particles: ${this.scene.particleSystems.reduce(
                (acc, cur) => acc + cur.particles.length,
                0
            )}`,
            `HTMLElements: ${this.scene.renderer.elements.size}`,
        ];

        if (this.showSystems) {
            const sysInfos: Array<string> = this.scene.particleSystems.map(
                function (system, index) {
                    return (
                        `System #${index + 1} (` +
                        [
                            `Σp: ${system.particles.length}`,
                            `Σt: ${system["durationTimer"].toFixed(3)}s`,
                        ].join(", ") +
                        `)`
                    );
                }
            );

            infos.push("--------------", ...sysInfos);
        }

        return infos;
    }
}
