import React from "react";

export interface ConfigDriverProps<TValue> {
    label: string;
    name?: string;

    get: () => TValue;
    set: (value: TValue) => void;
}

export abstract class ConfigDriver<
    TValue,
    TProps extends ConfigDriverProps<TValue> = ConfigDriverProps<TValue>,
    TState = {}
> extends React.Component<TProps, TState> {
    constructor(props: TProps) {
        super(props);
        this.state = this.getInitialState(props);
    }

    protected abstract getInitialState(props: TProps): TState;
    protected abstract getResult(): TValue;
    protected abstract renderInner(): JSX.Element;

    componentDidUpdate() {
        this.props.set(this.getResult());
    }

    public render() {
        return (
            <label>
                <span>{this.props.label}</span>
                {this.renderInner()}
            </label>
        );
    }
}
