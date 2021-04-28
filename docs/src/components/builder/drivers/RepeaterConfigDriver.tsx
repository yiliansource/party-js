import React from "react";

import { NumericConfigDriver, StringConfigDriver } from "./";
import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";
import { GroupResult, SchemaItem } from "./GroupConfigDriver";

export interface RepeaterConfigDriverProps
    extends ConfigDriverProps<GroupResult[]> {
    schema: SchemaItem[];
}

export interface RepeaterConfigDriverState {
    items: GroupResult[];
}

export class RepeaterConfigDriver extends ConfigDriver<
    GroupResult[],
    RepeaterConfigDriverProps,
    RepeaterConfigDriverState
> {
    getResult() {
        return this.state.items;
    }

    getInitialState(props: RepeaterConfigDriverProps) {
        return {
            items: (props.get && props.get()) || [],
        };
    }

    getWrapperClass() {
        return [...super.getWrapperClass(), "repeater-config-driver"];
    }

    addItem() {
        const item: Record<string, any> = {};
        for (const schemaItem of this.props.schema) {
            item[schemaItem.name] = schemaItem.type === "number" ? 0 : "";
        }

        this.setState({
            items: [...this.state.items, item],
        });
    }
    removeItem(index: number) {
        this.state.items.splice(index, 1);
        this.setState(this.state);
    }

    getGroupValue(index: number, name: string): any {
        return this.state.items[index][name];
    }

    setGroupValue(index: number, name: string, value: any): void {
        this.state.items[index][name] = value;
        this.setState(this.state);
    }

    renderInner() {
        return (
            <div className="driver-repeater">
                {this.state.items.map((repeaterItem, index) => {
                    return (
                        <div className="repeater-item" key={index}>
                            {this.props.schema.map((schemaItem) => {
                                const props: ConfigDriverProps<any> & {
                                    key: string;
                                } = {
                                    key: schemaItem.name,
                                    name: schemaItem.name,
                                    label: schemaItem.label,
                                    get: () =>
                                        this.getGroupValue(
                                            index,
                                            schemaItem.name
                                        ),
                                    set: (value) =>
                                        this.setGroupValue(
                                            index,
                                            schemaItem.name,
                                            value
                                        ),
                                };

                                if (schemaItem.type === "number") {
                                    return <NumericConfigDriver {...props} />;
                                }
                                if (schemaItem.type === "string") {
                                    return <StringConfigDriver {...props} />;
                                }
                            })}
                            <div
                                className="remove button button--secondary"
                                onClick={() => this.removeItem(index)}
                            >
                                Remove
                            </div>
                        </div>
                    );
                })}
                <div
                    className="add button button--secondary"
                    onClick={this.addItem.bind(this)}
                >
                    Add
                </div>
            </div>
        );
    }
}
