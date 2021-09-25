import party from "party-js";
import React, { createRef, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import CancelSVG from "./img/cancel.svg";
import CopySVG from "./img/copy.svg";
import PlaySVG from "./img/play.svg";
import TickSVG from "./img/tick.svg";
import styles from "./index.module.scss";

if (typeof window !== "undefined") {
    // react-codemirror2 offers SSR support, but the native CodeMirror library does not.
    // Therefore, we only import these libraries into the script if we are running client-side.
    require("codemirror/addon/selection/active-line");
    require("codemirror/lib/codemirror.css");
    require("codemirror/mode/javascript/javascript");
    require("codemirror/theme/dracula.css");
}

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
                ...["party", "mouseEvent", "codeblock", "runButton"],
                this.state.body
            );

            const context = this.getCodeblockContext();
            context.mouseEvent = event.nativeEvent;

            fun.call(undefined, ...Object.values(context));
        } catch (err) {
            this.setState({
                error: err.message,
            });
        }
    }

    getCodeblockContext(): Record<string, any> {
        return {
            party: party,
            mouseEvent: null,
            codeblock: this.codeblockRef.current,
            runButton: this.runButtonRef.current,
        };
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
                                You can use the following objects in your code:{" "}
                                {Object.keys(this.getCodeblockContext()).map(
                                    (c, i) => (
                                        <Fragment key={i}>
                                            {i > 0 && <span>, </span>}
                                            <code>{c}</code>
                                        </Fragment>
                                    )
                                )}
                                .
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
}
