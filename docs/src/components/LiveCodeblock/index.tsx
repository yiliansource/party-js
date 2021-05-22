import BrowserOnly from "@docusaurus/BrowserOnly";
import clsx from "clsx";
import "codemirror/addon/selection/active-line";
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
    error: string;
    hasCopied: boolean;
}

export default class LiveCodeblock extends React.Component<
    unknown,
    LiveCodeblockState
> {
    private initialContentRef: React.RefObject<HTMLDivElement>;
    private codeblockRef: React.RefObject<HTMLDivElement>;
    private runButtonRef: React.RefObject<HTMLButtonElement>;

    private editor: CodeMirror.Editor;

    constructor(props: React.PropsWithChildren<unknown>) {
        super(props);

        this.initialContentRef = createRef();
        this.codeblockRef = createRef();
        this.runButtonRef = createRef();

        this.state = {
            body: null,
            error: null,
            hasCopied: false,
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
            <div ref={this.codeblockRef} className={styles.liveCodeblock}>
                {this.state.body === null && (
                    <div ref={this.initialContentRef}>
                        {this.props.children}
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
                            lineNumbers: true,
                            // @ts-ignore
                            styleActiveLine: { nonEmpty: true },
                        }}
                        editorDidMount={(editor) =>
                            (this.editor = editor as any)
                        }
                        onBeforeChange={(editor, data, value) => {
                            this.setState({ body: value });
                        }}
                    />
                )}

                <div className="toolbar">
                    <div className="output">
                        {this.state.error ? (
                            <span className="error">
                                <CancelSVG />
                                {this.state.error}
                            </span>
                        ) : (
                            <span className="info">
                                You can use the following objects in your
                                code:&nbsp;
                                <code>party</code>, <code>codeblock</code>
                                ,&nbsp;
                                <code>mouseEvent</code>, <code>runButton</code>.
                            </span>
                        )}
                    </div>
                    <div className="controls">
                        <button
                            className="copy"
                            onClick={this.handleCopyClick.bind(this)}
                        >
                            {this.state.hasCopied ? <TickSVG /> : <CopySVG />}
                        </button>
                        <button
                            className="run"
                            onClick={this.handleRunClick.bind(this)}
                            ref={this.runButtonRef}
                        >
                            <PlaySVG />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    handleCopyClick(event: React.MouseEvent) {
        navigator.clipboard.writeText(this.editor.getValue()).then(() => {
            this.setState({ hasCopied: true });
            window.setTimeout(() => {
                this.setState({ hasCopied: false });
            }, 2000);
        });
    }

    handleRunClick(event: React.MouseEvent) {
        try {
            const fun: Function = Function.call(
                undefined,
                ...["party", "codeblock", "mouseEvent", "runButton"],
                this.state.body
            );
            fun.call(
                undefined,
                party,
                this.codeblockRef.current,
                event.nativeEvent,
                this.runButtonRef.current
            );
        } catch (err) {
            this.setState({
                error: err.message,
            });
        }
    }
}
