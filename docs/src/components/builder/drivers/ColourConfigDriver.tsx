import * as party from "party-js";
import React from "react";

import { ConfigDriver } from "./ConfigDriver";

export class ColourConfigDriver extends ConfigDriver<party.Colour> {
    getInitialState() {
        return {};
    }
    getResult() {
        return party.Colour.black;
    }
    renderInner() {
        return <div></div>;
    }
}
