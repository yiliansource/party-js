import React, { Fragment } from "react";

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
    getInitialState(props: NumericConfigDriverProps): NumericConfigDriverState {
        return {
            input: props.get().toString(),
        };
    }
    getResult() {
        return parseInt(this.state.input) || 0;
    }
    handleValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value;
        if (!/^-?\d*$/.test(input)) {
            return;
        }

        this.setState({
            input: event.target.value,
        });
    }

    renderInner() {
        return (
            <Fragment>
                <input
                    type="text"
                    name={this.props.name}
                    min={this.props.min}
                    value={this.state.input}
                    onChange={this.handleValueChanged.bind(this)}
                />
                <span>{this.getResult()}</span>
            </Fragment>
        );
    }
}
