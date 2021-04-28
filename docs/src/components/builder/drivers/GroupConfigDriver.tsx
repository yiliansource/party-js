import React from "react";

import { NumericConfigDriver, StringConfigDriver } from "./";
import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

export type GroupResult = Record<string, any>;

export interface SchemaItem {
    label: string;
    name: string;
    type: "string" | "number";
}

export interface GroupConfigDriverProps extends ConfigDriverProps<GroupResult> {
    schema: SchemaItem[];
}

export class GroupConfigDriver extends ConfigDriver<
    GroupResult,
    GroupConfigDriverProps,
    Record<string, any>
> {
    getResult() {
        return this.state;
    }

    getInitialState(props: GroupConfigDriverProps) {
        return (props.get && props.get()) || {};
    }

    getWrapperClass() {
        return [...super.getWrapperClass(), "group-config-driver"];
    }

    getGroupValue(name: string): any {
        return this.state[name];
    }
    setGroupValue(name: string, value: any): void {
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    renderInner() {
        return (
            <div className="driver-group">
                {this.props.schema.map((item) => {
                    const props: ConfigDriverProps<any> & { key: string } = {
                        key: item.name,
                        name: item.name,
                        label: item.label,
                        get: () => this.getGroupValue(item.name),
                        set: (value) => this.setGroupValue(item.name, value),
                    };

                    if (item.type === "number") {
                        return <NumericConfigDriver {...props} />;
                    }
                    if (item.type === "string") {
                        return <StringConfigDriver {...props} />;
                    }
                })}
            </div>
        );
    }
}
