import party from "party-js";
import React, { useEffect, useState } from "react";

import CursorSvg from "../../static/img/cursor.svg";
import styles from "./DemoWidget.module.scss";

interface DemoTemplate<T> {
    label: string;
    params: {
        name: string;
        key: keyof T;
        type: "number";
        default: number;

        min?: number;
        max?: number;
        step?: number;
    }[];
    method: (e: MouseEvent, config: Partial<T>) => void;
}

const templates: DemoTemplate<any>[] = [
    {
        label: "Confetti",
        params: [
            {
                name: "Count",
                key: "count",
                type: "number",
                default: 30,
                min: 0,
                max: 60,
            },
            {
                name: "Spread",
                key: "spread",
                type: "number",
                default: 40,
                min: 0,
                max: 80,
            },
            {
                name: "Size",
                key: "size",
                type: "number",
                default: 1,
                min: 0,
                max: 2,
                step: 0.05,
            },
        ],
        method: party.confetti,
    } as DemoTemplate<party.ConfettiConfiguration>,
    {
        label: "Sparkles",
        params: [
            {
                name: "Count",
                key: "count",
                type: "number",
                default: 15,
                min: 0,
                max: 40,
            },
            {
                name: "Size",
                key: "size",
                type: "number",
                default: 1,
                min: 0,
                max: 2,
                step: 0.05,
            },
        ],
        method: party.sparkles,
    } as DemoTemplate<party.SparkleConfiguration>,
];

export default function DemoWidget() {
    const [template, setTemplate] = useState<DemoTemplate<any>>(null);
    const [configuration, setConfiguration] = useState<Record<string, any>>(null);

    useEffect(() => {
        setTemplateWithConfig(templates[0]);
    }, []);

    function handleAreaClick(e: React.MouseEvent) {
        template.method(e.nativeEvent, configuration);
    }
    function setTemplateWithConfig(t: DemoTemplate<any>) {
        setTemplate(t);

        const config = {};
        for (const param of t.params) {
            config[param.key] = param.default;
        }
        setConfiguration(config);
    }
    function setConfigValue(key: string, value: any) {
        setConfiguration((c) => ({
            ...c,
            [key]: value,
        }));
    }

    return (
        <div className={styles.demoWidget}>
            <div className="templateSelect">
                <h3>Template</h3>
                <ul>
                    {templates.map((t) => (
                        <li
                            key={t.label}
                            className={t === template ? "active" : ""}
                            onClick={() => setTemplateWithConfig(t)}
                        >
                            {t.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="demoArea" onClick={handleAreaClick}>
                <CursorSvg />
            </div>
            <div className="configuration">
                <h3>Configuration</h3>
                <ul>
                    {template &&
                        template.params.map((p) => (
                            <li key={p.key.toString()}>
                                <p className="name">{p.name}:</p>
                                <div className="input">
                                    <input
                                        type="range"
                                        min={p.min === undefined ? 0 : p.min}
                                        max={p.max === undefined ? 10 : p.max}
                                        step={p.step === undefined ? 1 : p.step}
                                        defaultValue={p.default}
                                        onChange={(e) => setConfigValue(p.key.toString(), +e.target.value)}
                                    />
                                    <p className="current">{configuration[p.key.toString()]}</p>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
