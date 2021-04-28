import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import * as party from "party-js";
import React from "react";

import EmitterConfig, {
    EmitterConfigState,
} from "../components/builder/EmitterConfig";
import EmitterPreview from "../components/builder/EmitterPreview";
import styles from "../css/builder.module.css";

export default class Builder extends React.Component {
    emitter: party.Emitter;

    constructor(props: any) {
        super(props);

        this.handleConfigChange = this.handleConfigChange.bind(this);

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

    handleConfigChange(set: EmitterConfigState): void {
        this.emitter.emission.rate = set.rate;
    }

    render() {
        return (
            <Layout
                title="Builder"
                description="Use the site's integrated effect builder to customize"
            >
                <BrowserOnly fallback={<div>Loading effect builder ...</div>}>
                    {() => (
                        <div
                            id="effect-builder"
                            className={clsx(styles.effectBuilder)}
                        >
                            <EmitterConfig
                                emitter={this.emitter}
                                onConfigChange={this.handleConfigChange}
                            />
                            <EmitterPreview emitter={this.emitter} />
                        </div>
                    )}
                </BrowserOnly>
            </Layout>
        );
    }
}
