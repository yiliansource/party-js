import clsx from "clsx";
import * as party from "party-js";
import * as options from "party-js/dist/particles/options";
import React from "react";

import styles from "../../css/builder.module.css";
import {
    BooleanConfigDriver,
    NumericConfigDriver,
    ColourConfigDriver,
    GroupConfigDriver,
    RepeaterConfigDriver,
    SelectConfigDriver,
    StringConfigDriver,
} from "./drivers";

export interface EmitterConfigProps {
    emitter: party.Emitter;
}

export default class EmitterConfig extends React.Component<EmitterConfigProps> {
    constructor(props: EmitterConfigProps) {
        super(props);

        this.state = {
            rate: props.emitter.emission.rate,
        };

        this.handleConfigChange = this.handleConfigChange.bind(this);
    }

    handleConfigChange(name: string, value: unknown) {
        this.setState({
            [name]: value,
        } as any);
    }

    render() {
        return (
            <div className={clsx(styles.emitterConfig)}>
                <h2>Configuration</h2>
                <p>Configure the emitter here.</p>

                <div className="row margin-bottom-sm">
                    <div className="col">
                        <NumericConfigDriver label="Duration" />
                    </div>
                    <div className="col">
                        <NumericConfigDriver label="Loops" />
                    </div>
                    <div className="col">
                        <NumericConfigDriver label="Rate" />
                    </div>
                    <div className="col">
                        <NumericConfigDriver label="Max. Particles" />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <RepeaterConfigDriver
                            label="Bursts"
                            get={() => this.props.emitter.emission.bursts}
                            set={(value) =>
                                (this.props.emitter.emission.bursts = value as any)
                            }
                            schema={[
                                { label: "Time", name: "time", type: "number" },
                                {
                                    label: "Count",
                                    name: "count",
                                    type: "number",
                                },
                                {
                                    label: "Probability",
                                    name: "probability",
                                    type: "number",
                                },
                            ]}
                        />
                    </div>
                </div>

                <hr />

                <div className="row margin-bottom-sm">
                    <div className="col">
                        <NumericConfigDriver label="Lifetime" />
                    </div>
                    <div className="col">
                        <NumericConfigDriver label="Speed" />
                    </div>
                    <div className="col">
                        <NumericConfigDriver label="Size" />
                    </div>
                    <div className="col">
                        <StringConfigDriver label="Colour" />
                    </div>
                </div>

                <div className="row">
                    <div className="col col--8">
                        <GroupConfigDriver
                            label="Rotation"
                            schema={[
                                {
                                    label: "X",
                                    name: "x",
                                    type: "number",
                                },
                                {
                                    label: "Y",
                                    name: "y",
                                    type: "number",
                                },
                                {
                                    label: "Z",
                                    name: "z",
                                    type: "number",
                                },
                            ]}
                        />
                    </div>
                    <div className="col">
                        <BooleanConfigDriver label="Use Gravity?" />
                    </div>
                </div>
            </div>
        );
    }
}
