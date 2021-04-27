import clsx from "clsx";
import * as party from "party-js";
import * as options from "party-js/dist/particles/options";
import React from "react";

import styles from "../../css/builder.module.css";
import {
    NumericConfigDriver,
    ColourConfigDriver,
    GroupConfigDriver,
    RepeaterConfigDriver,
    SelectConfigDriver,
} from "./drivers";

export interface EmitterConfigProps {
    emitter: party.Emitter;

    onConfigChange: (state: EmitterConfigState) => void;
}
export interface EmitterConfigState {
    rate: number;
}

export default class EmitterConfig extends React.Component<
    EmitterConfigProps,
    EmitterConfigState
> {
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

                <NumericConfigDriver
                    label="Rate"
                    min={0}
                    step={1}
                    get={() => this.props.emitter.emission.rate}
                    set={(value) => (this.props.emitter.emission.rate = value)}
                />
                <NumericConfigDriver
                    label="Duration"
                    min={1}
                    step={1}
                    get={() => this.props.emitter.options.duration}
                    set={(value) =>
                        (this.props.emitter.options.duration = value)
                    }
                />

                <hr />

                <GroupConfigDriver
                    label="Rotation"
                    schema={[
                        {
                            label: "X",
                            type: "number",
                        },
                    ]}
                    get={() => {
                        const [x, y, z] = (this.props.emitter.options
                            .initialRotation as party.Vector).xyz;
                        return { x, y, z };
                    }}
                    set={(result: Record<string, number>) => {
                        this.props.emitter.options.initialRotation = new party.Vector(
                            result.x,
                            result.y,
                            result.z
                        );
                    }}
                />
            </div>
        );
    }
}
