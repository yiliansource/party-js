import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import * as party from "party-js";
import React from "react";

import EmitterConfig, {
    EmitterOptionSet,
} from "../components/builder/emitter-config";
import EmitterPreview from "../components/builder/emitter-preview";
import styles from "../css/builder.module.css";

export default class Builder extends React.Component {
    emitter: party.Emitter;

    constructor(props) {
        super(props);

        this.handleConfigChange = this.handleConfigChange.bind(this);

        party.settings.debug = true;
        party.scene.current.emitters = [];
        this.emitter = party.scene.current.createEmitter({
            emitterOptions: {
                initialColour: party.Colour.black,
            },
            rendererOptions: {
                shapeFactory: "circle",
            },
        });
    }

    handleConfigChange(set: EmitterOptionSet): void {
        Object.assign(this.emitter.options, {
            emission: set.emission,
        } as Partial<party.Emitter>);
        this.setState(this.state);

        // TODO: For some reason the components don't re-render...
        console.log("state!");
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
                                onOptionChange={this.handleConfigChange}
                            />
                            <EmitterPreview emitter={this.emitter} />
                        </div>
                    )}
                </BrowserOnly>
            </Layout>
        );
    }
}
