import React from "react";

import { ConfigDriver, ConfigDriverProps } from "./ConfigDriver";

export type GroupSchemaResult = Record<string, string | number>;

export interface GroupSchemaItem {
    label: string;
    type: "string" | "number";
}

export interface GroupConfigDriverProps
    extends ConfigDriverProps<GroupSchemaResult> {
    schema: GroupSchemaItem[];
}

export interface GroupConfigDriverState {
    inputs: Record<string, string | number>;
}

export class GroupConfigDriver extends ConfigDriver<
    GroupSchemaResult,
    GroupConfigDriverProps,
    GroupConfigDriverState
> {
    getInitialState() {
        return {
            inputs: {
                x: 45,
                y: 0,
                z: 0,
            },
        };
    }
    getResult() {
        return this.state.inputs;
    }
    renderInner() {
        return <div></div>;
    }
}
