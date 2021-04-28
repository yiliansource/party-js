import React from "react";

import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

export interface SelectConfigDriverProps<TSelect>
    extends ConfigDriverProps<TSelect> {
    items: TSelect[] | [TSelect, string][];
}

export interface SelectConfigDriverState<TSelect> {
    value: TSelect;
}

export class SelectConfigDriver<
    TSelect extends string | number
> extends ConfigDriver<
    TSelect,
    SelectConfigDriverProps<TSelect>,
    SelectConfigDriverState<TSelect>
> {
    getInitialState(props: SelectConfigDriverProps<TSelect>) {
        return {
            value: (props.get && props.get()) || undefined,
        };
    }
    getResult() {
        return this.state.value;
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({
            value: event.target.value as TSelect,
        });
    }

    renderInner() {
        return (
            <select
                className="driver-select"
                value={this.state.value}
                onChange={this.handleSelectChange.bind(this)}
            >
                {this.props.items.map((item) => {
                    const [value, label] = Array.isArray(item)
                        ? item
                        : [item, item];
                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>
        );
    }
}
