import React, { FunctionComponent } from "react";

interface DemoButtonProps {
    demoMethod: string;
}

const DemoButton: FunctionComponent<DemoButtonProps> = ({
    demoMethod,
}: DemoButtonProps) => (
    <div
        id={demoMethod}
        className="demoButton"
        // Workaround to call a demo method by it's name.
        onClick={() => (window as any)[demoMethod](demoMethod)}
    >
        <img src="/img/cursor.svg" />
    </div>
);
export default DemoButton;
