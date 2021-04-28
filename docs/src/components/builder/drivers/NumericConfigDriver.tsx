import React from "react";

import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

interface NumericConfigDriverProps extends ConfigDriverProps<number> {
    min?: number;
    max?: number;
    step?: number;
}
interface NumericConfigDriverState {
    input: string;
}

export class NumericConfigDriver extends ConfigDriver<
    number,
    NumericConfigDriverProps,
    NumericConfigDriverState
> {
    static defaultProps: Partial<NumericConfigDriverProps> = {
        max: Number.POSITIVE_INFINITY,
        min: Number.NEGATIVE_INFINITY,
        step: 1,
    };

    getInitialState(props: NumericConfigDriverProps): NumericConfigDriverState {
        return {
            input: ((props.get && props.get()) || 0).toString(),
        };
    }
    getResult(): number {
        const parsed = parseFloat(this.state.input) || 0;
        return Math.min(this.props.max, Math.max(this.props.min, parsed));
    }
    handleValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value;
        if (!/^-?\d*(\.\d*)?$/.test(input)) {
            return;
        }

        this.setState({
            input: event.target.value,
        });
    }

    renderInner() {
        return (
            <input
                className="driver-input numeric"
                type="text"
                name={this.props.name}
                value={this.state.input}
                onChange={this.handleValueChanged.bind(this)}
            />
        );
    }
}
