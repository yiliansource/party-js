import useThemeContext from "@theme/hooks/useThemeContext";
import party from "party-js";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import CancelSVG from "./img/cancel.svg";
import CopySVG from "./img/copy.svg";
import PlaySVG from "./img/play.svg";
import TickSVG from "./img/tick.svg";
import styles from "./index.module.scss";

if (typeof window !== "undefined") {
    // react-codemirror2 offers SSR support, but the native CodeMirror library does not.
    // Therefore, we only import these libraries into the script if we are running client-side.
    require("codemirror/lib/codemirror.css");
    require("codemirror/mode/javascript/javascript");

    require("codemirror/addon/edit/matchbrackets");
    require("codemirror/addon/selection/active-line");

    // Load highlighting themes
    require("codemirror/theme/material-palenight.css");
    require("./nightowl-light.css");
}

export interface LiveCodeblockProps {
    code?: string;
}

export default function LiveCodeblock({ code, children }: React.PropsWithChildren<LiveCodeblockProps>): JSX.Element {
    const [body, setBody] = useState<string>(code || null);
    const [error, setError] = useState<string>(null);
    const [editor, setEditor] = useState<CodeMirror.Editor>(null);
    const [hasCopied, setHasCopied] = useState<boolean>(false);

    const codeblockRef = useRef<HTMLDivElement>();
    const runButtonRef = useRef<HTMLButtonElement>();
    const initialContentRef = useRef<HTMLDivElement>();

    const { isDarkTheme } = useThemeContext();

    useEffect(() => {
        if (!body && initialContentRef.current) {
            const initialBody = Array.from(initialContentRef.current.querySelectorAll(".token-line"))
                .map((line: HTMLDivElement) => line.innerText)
                .join("\n")
                .replace(/ {4}/g, "\t");

            setBody(initialBody);
        }
    }, []);

    function getCodeblockContext(): Record<string, any> {
        return {
            party: party,
            mouseEvent: null,
            codeblock: codeblockRef.current,
            runButton: runButtonRef.current,
        };
    }

    const handleCopyClick = () => {
        navigator.clipboard.writeText(editor.getValue()).then(() => {
            setHasCopied(true);
            window.setTimeout(() => setHasCopied(false), 2000);
        });
    };

    const handleRunClick = (event: React.MouseEvent) => {
        try {
            const context = getCodeblockContext();
            context.mouseEvent = event.nativeEvent;

            const fun = Function(...Object.keys(context), body);
            fun.call(undefined, ...Object.values(context));
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
                setError(err.name + ": " + err.message);
            }
        }
    };

    return (
        <div ref={codeblockRef} className={styles.liveCodeblock}>
            {body === null ? (
                <div ref={initialContentRef}>{children}</div>
            ) : (
                <div className="editor">
                    <CodeMirror
                        value={body}
                        options={{
                            theme: isDarkTheme ? "material-palenight" : "nightowl-light",
                            mode: "javascript",
                            indentWithTabs: true,
                            tabSize: 4,
                            indentUnit: 4,
                            smartIndent: true,
                            lineNumbers: true,
                            ...{
                                // addon config
                                matchBrackets: true,
                                styleActiveLine: { nonEmpty: true },
                            },
                        }}
                        editorDidMount={(editor) => setEditor(editor)}
                        onBeforeChange={(editor, data, value) => setBody(value)}
                    />
                </div>
            )}

            <div className="toolbar">
                <div className="output">
                    {error ? (
                        <span className="error">
                            <CancelSVG />
                            {error}
                        </span>
                    ) : (
                        <span className="info">
                            You can use the following objects in this codeblock:{" "}
                            {Object.keys(getCodeblockContext()).map((c, i) => (
                                <Fragment key={i}>
                                    {i > 0 && <span>, </span>}
                                    <code>{c}</code>
                                </Fragment>
                            ))}
                            .
                        </span>
                    )}
                </div>
                <div className="controls">
                    <button className="copy" onClick={handleCopyClick}>
                        {hasCopied ? <TickSVG /> : <CopySVG />}
                    </button>
                    <button className="run" onClick={handleRunClick} ref={runButtonRef}>
                        <PlaySVG />
                    </button>
                </div>
            </div>
        </div>
    );
}
