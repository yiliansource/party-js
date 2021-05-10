import React, { createRef } from "react";

import styles from "./Accordion.module.scss";
import Chevron from "./Chevron";

interface AccordionProps {
    icon?: string;
    title: string;
}
interface AccordionState {
    expanded: boolean;
    height: number;
}

export default class Accordion extends React.Component<
    AccordionProps,
    AccordionState
> {
    content: React.MutableRefObject<HTMLDivElement>;
    constructor(props: AccordionProps) {
        super(props);
        this.state = {
            expanded: false,
            height: 0,
        };
        this.content = createRef();
    }

    render(): React.ReactNode {
        return (
            <div
                className={`${styles.accordion} ${
                    this.state.expanded ? "active" : ""
                }`}
            >
                <div
                    className={styles.header}
                    onClick={this.toggleExpanded.bind(this)}
                >
                    {this.props.icon ? (
                        <img className={styles.icon} src={this.props.icon} />
                    ) : null}
                    <span className={styles.title}>{this.props.title}</span>
                    <Chevron
                        direction={this.state.expanded ? "down" : "right"}
                    />
                </div>
                <div
                    ref={this.content}
                    className={styles.content}
                    style={{
                        maxHeight: this.state.height + "px",
                    }}
                >
                    <div className={styles.wrapper}>{this.props.children}</div>
                </div>
            </div>
        );
    }

    toggleExpanded(): void {
        this.setState({
            expanded: !this.state.expanded,
            height: this.state.expanded ? 0 : this.content.current.scrollHeight,
        });
    }
}
