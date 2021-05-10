import React, { FunctionComponent } from "react";

import ChevronSVG from "../../static/img/chevron.svg";
import styles from "./Chevron.module.scss";

interface ChevronProps {
    direction?: "right" | "down";
}

const Chevron: FunctionComponent<ChevronProps> = ({
    direction = "right",
}: ChevronProps) => (
    <span className={`${styles.chevron} ${styles[direction]}`}>
        <ChevronSVG />
    </span>
);

export default Chevron;
