import party from "party-js";
import React from "react";

import styles from "./DemoCodeblock.module.scss";

interface DemoCodeblockProps {
    method: (party: any, e: React.MouseEvent) => void;
    children?: React.ReactNode;
}

export default class DemoCodeblock extends React.Component<DemoCodeblockProps> {
    render() {
        return (
            <div className={styles.demoCodeblock}>
                {this.props.children}
                <div
                    className={styles.background}
                    onClick={this.clickHandler.bind(this)}
                >
                    <p>Click me to try it out!</p>
                </div>
            </div>
        );
    }
    clickHandler(e: React.MouseEvent) {
        e.persist();
        this.props.method(party, e);
    }
}
