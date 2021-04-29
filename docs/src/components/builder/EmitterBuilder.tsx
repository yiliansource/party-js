import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import clsx from "clsx";
import * as party from "party-js";
import React from "react";

import styles from "../../css/builder.module.css";
import EmitterConfig from "./EmitterConfig";
import EmitterPreview from "./EmitterPreview";

export default class EmitterBuilder extends React.Component {
    emitter: party.Emitter;

    constructor(props: any) {
        super(props);

        party.scene.current.emitters = [];
        this.emitter = party.scene.current.createEmitter({
            emitterOptions: {
                initialColour: party.Colour.fromHsl(10, 90, 60),
            },
            emissionOptions: {
                bursts: [{ time: 0, count: 20, probability: 1 }],
            },
            rendererOptions: {
                shapeFactory: "circle",
            },
        });

        const sizeModule = this.emitter.addModule(party.modules.SizeModifier);
        sizeModule.size = new party.NumericSpline(
            { time: 0, value: 0 },
            { time: 0.05, value: 1 }
        );
    }

    componentWillUnmount() {
        party.scene.current.emitters = [];
    }

    render() {
        return (
            <div id="effect-builder" className={clsx(styles.effectBuilder)}>
                <div className="">
                    <EmitterConfig emitter={this.emitter} />
                </div>
                <div className="">
                    <EmitterPreview emitter={this.emitter} />
                </div>
            </div>
        );
    }
}
