import React from "react";

import { ConfigDriver } from "./ConfigDriver";

export class SelectConfigDriver<TSelect> extends ConfigDriver<TSelect> {
    getInitialState() {
        return {};
    }
    getResult() {
        return undefined;
    }
    renderInner() {
        return <div></div>;
    }
}
