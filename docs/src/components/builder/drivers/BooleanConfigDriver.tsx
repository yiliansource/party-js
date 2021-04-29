import React from "react";

import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

interface BooleanConfigDriverProps extends ConfigDriverProps<boolean> {}
interface BooleanConfigDriverState {
    input: boolean;
}

export class BooleanConfigDriver extends ConfigDriver<
    boolean,
    BooleanConfigDriverProps,
    BooleanConfigDriverState
> {
    getInitialState(props: BooleanConfigDriverProps): BooleanConfigDriverState {
        return {
            input: (props.get && props.get()) || false,
        };
    }
    getResult(): boolean {
        return this.state.input;
    }
    handleValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            input: event.target.checked,
        });
    }

    renderInner() {
        return (
            <input
                className="driver-input boolean"
                type="checkbox"
                name={this.props.name}
                checked={this.state.input}
                onChange={this.handleValueChanged.bind(this)}
            />
        );
    }
}
