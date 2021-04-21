// @ts-ignore
import ChevronSVG from "../../static/img/chevron.svg";
import React, { FunctionComponent } from "react";

interface ChevronProps {
    direction?: "right" | "down";
}

const Chevron: FunctionComponent<ChevronProps> = ({
    direction = "right",
}: ChevronProps) => (
    <span className={`chevron ${direction}`}>
        <ChevronSVG />
    </span>
);

export default Chevron;
