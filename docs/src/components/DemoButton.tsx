import React, { FunctionComponent, useRef } from "react";

import styles from "./DemoButton.module.scss";

interface DemoButtonProps {
    demoMethod: (source: HTMLElement) => void;
}

const DemoButton: FunctionComponent<DemoButtonProps> = ({ demoMethod }: DemoButtonProps) => {
    const elementReference = useRef(null);
    return (
        <div
            ref={elementReference}
            id={demoMethod.name}
            className={styles.demoButton}
            onClick={() => demoMethod.call(null, elementReference.current)}
        >
            <img src="/img/cursor.svg" />
        </div>
    );
};
export default DemoButton;
