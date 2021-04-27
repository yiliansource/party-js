import React from "react";

import { ConfigDriver } from "./ConfigDriver";
import { GroupSchemaResult } from "./GroupConfigDriver";

type RepeaterResult = GroupSchemaResult[];

export class RepeaterConfigDriver extends ConfigDriver<RepeaterResult> {
    getInitialState() {
        return {};
    }
    getResult() {
        return [];
    }
    renderInner() {
        return <div></div>;
    }
}
