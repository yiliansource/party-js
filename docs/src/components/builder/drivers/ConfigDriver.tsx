import React from "react";

export interface ConfigDriverProps<TValue> {
    label?: string;
    name?: string;

    get?: () => TValue;
    set?: (value: TValue) => void;
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

    public abstract getResult(): TValue;

    protected abstract getInitialState(props: TProps): TState;
    protected abstract renderInner(): JSX.Element;

    protected getWrapperClass(): string[] {
        return ["config-driver"];
    }

    componentDidUpdate(prevProps: TProps, prevState: TState) {
        if (this.state !== prevState) {
            this.props.set && this.props.set(this.getResult());
        }
    }

    public render() {
        return (
            <label className={this.getWrapperClass().join(" ")}>
                {this.props.label && (
                    <span className="label">{this.props.label}</span>
                )}
                {this.renderInner()}
            </label>
        );
    }
}
