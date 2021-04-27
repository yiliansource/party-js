import clsx from "clsx";
import * as party from "party-js";
import * as options from "party-js/dist/particles/options";
import React from "react";

import styles from "../../css/builder.module.css";

export interface EmitterConfigProps {
    emitter: party.Emitter;

    onOptionChange: (set: EmitterOptionSet) => void;
}
export interface EmitterConfigState {
    optionSet: EmitterOptionSet;
}

export interface EmitterOptionSet {
    emission: options.EmissionOptions;
}

export default class EmitterConfig extends React.Component<
    EmitterConfigProps,
    EmitterConfigState
> {
    constructor(props: EmitterConfigProps) {
        super(props);

        this.state = {
            optionSet: {
                emission: props.emitter.emission,
            },
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const path = event.target.name;
        const segments = path.split(".");
        const identifier = segments.pop();

        let obj: Record<string, any> = this.state.optionSet;
        segments.forEach((seg) => {
            obj = obj[seg];
        });

        const isNumeric = event.target.hasAttribute("data-isnumeric");

        obj[identifier] = isNumeric
            ? parseInt(event.target.value)
            : event.target.value;
        this.props.onOptionChange(this.state.optionSet);
    }

    render() {
        return (
            <div className={clsx(styles.emitterConfig)}>
                <h2>Configuration</h2>
                <p>Configure the emitter here.</p>
                <label>
                    <span>Value</span>
                    <input
                        name="emission.rate"
                        data-isnumeric
                        value={this.props.emitter.emission.rate}
                        onChange={this.handleInputChange}
                        type="text"
                    />
                </label>
            </div>
        );
    }
}
