import clsx from "clsx";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import party from "party-js";
import React, { createRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import CancelSVG from "./img/cancel.svg";
import CopySVG from "./img/copy.svg";
import InfoSVG from "./img/info.svg";
import PlaySVG from "./img/play.svg";
import TickSVG from "./img/tick.svg";
import styles from "./index.module.scss";

export interface LiveCodeblockState {
    body: string;
    showInfo: boolean;
    error: string;
}

export default class LiveCodeblock extends React.Component<
    unknown,
    LiveCodeblockState
> {
    private initialContentRef: React.RefObject<HTMLDivElement>;
    private codeblockRef: React.RefObject<HTMLDivElement>;
    private buttonRef: React.RefObject<HTMLButtonElement>;

    private editor: CodeMirror.Editor;

    constructor(props: React.PropsWithChildren<unknown>) {
        super(props);

        this.initialContentRef = createRef();

        this.state = {
            body: null,
            showInfo: true,
            error: "test",
        };
    }

    componentDidMount() {
        const initialBody = Array.from(
            this.initialContentRef.current.querySelectorAll(".token-line")
        )
            .map((line: HTMLDivElement) => line.innerText)
            .join("\n")
            .replace(/ {4}/g, "\t");

        this.setState({
            body: initialBody,
        });
    }

    render() {
        return (
            <div className={styles.liveCodeblock}>
                {this.state.body === null && (
                    <div ref={this.initialContentRef}>
                        {this.props.children}
                    </div>
                )}

                <div className={styles.toolbar}>
                    <button
                        className={clsx(
                            styles.infoButton,
                            this.state.showInfo && styles.active
                        )}
                        onClick={this.handleInfoClick.bind(this)}
                    >
                        <InfoSVG />
                    </button>
                    <button>
                        <CopySVG />
                    </button>
                    <button onClick={this.handleRunClick.bind(this)}>
                        <PlaySVG />
                    </button>
                </div>
                {this.state.showInfo && (
                    <div className={styles.infoPopup}>
                        You can use the global <code>party</code>,{" "}
                        <code>codeblock</code>, <code>mouseEvent</code> and{" "}
                        <code>runButton</code> objects in your code!
                    </div>
                )}
                {this.state.body !== null && (
                    <CodeMirror
                        value={this.state.body}
                        options={{
                            theme: "dracula",
                            mode: "javascript",
                            indentWithTabs: true,
                            tabSize: 4,
                            indentUnit: 4,
                            smartIndent: true,
                        }}
                        editorDidMount={(editor) => (this.editor = editor)}
                        onBeforeChange={(editor, data, value) => {
                            this.setState({ body: value });
                        }}
                    />
                )}
                {this.state.error && (
                    <div className={styles.errorPopup}>{this.state.error}</div>
                )}
            </div>
        );
    }

    handleInfoClick(event: React.MouseEvent) {
        this.setState({
            showInfo: !this.state.showInfo,
        });
    }

    handleCopyClick(event: React.MouseEvent) {}

    handleRunClick(event: React.MouseEvent) {
        try {
            const fun: Function = Function.call(
                undefined,
                ...["party", "codeblock", "mouseEvent", "runButton"],
                this.state.body
            );
            fun.call(undefined, party, null, event.nativeEvent, null);
        } catch (err) {
            this.setState({
                error: err.message,
            });
        }
    }
}
