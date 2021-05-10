import party from "party-js";
import React from "react";

export default () => (
    <>
        <style>
            {`.shapeSample { 
                --shape-color: var(--ifm-color-primary);
                position: relative;
            }
            .shapeSample > * {
                position: absolute;
                left: 50%; top: 50%;
                transform: translate(-50%, -50%) scale(2);
            }
            .shapeSample > div { 
                background: var(--shape-color); 
            }
            .shapeSample > svg { 
                color: var(--shape-color); 
            }`}
        </style>
        <table>
            <thead>
                <tr>
                    <th>Identifier</th>
                    <th>Element</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(party.resolvableShapes)
                    // Make sure that custom registered shapes arent rendered.
                    .filter((key) => !["heart"].includes(key))
                    .map((key) => (
                        <tr key={key}>
                            <td>
                                <code>{key}</code>
                            </td>
                            <td>
                                <div
                                    className="shapeSample"
                                    dangerouslySetInnerHTML={{
                                        __html: party.resolvableShapes[key],
                                    }}
                                ></div>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </>
);
