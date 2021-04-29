import React from "react";

import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

interface StringConfigDriverProps extends ConfigDriverProps<string> {}
interface StringConfigDriverState {
    input: string;
}

export class StringConfigDriver extends ConfigDriver<
    string,
    StringConfigDriverProps,
    StringConfigDriverState
> {
    getInitialState(props: StringConfigDriverProps): StringConfigDriverState {
        return {
            input: (props.get && props.get()) || "",
        };
    }
    getResult(): string {
        return this.state.input;
    }
    handleValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            input: event.target.value,
        });
    }

    renderInner() {
        return (
            <input
                className="driver-input string"
                type="text"
                name={this.props.name}
                value={this.state.input}
                onChange={this.handleValueChanged.bind(this)}
            />
        );
    }
}
