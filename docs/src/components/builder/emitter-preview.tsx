import clsx from "clsx";
import * as party from "party-js";
import React, { createRef } from "react";

import styles from "../../css/builder.module.css";

export interface EmitterPreviewProps {
    emitter: party.Emitter;
}

export default class EmitterPreview extends React.Component<EmitterPreviewProps> {
    container: React.RefObject<HTMLDivElement>;

    constructor(props: EmitterPreviewProps) {
        super(props);

        this.container = createRef();
    }

    componentDidMount() {
        this.props.emitter.shape.source = party.util.sourceToRect(
            this.container.current
        );
    }

    render() {
        return (
            <div ref={this.container} className={clsx(styles.emitterPreview)}>
                <h2>Preview</h2>
            </div>
        );
    }
}
