import React, { FunctionComponent } from "react";

interface DemoButtonProps {
    demoMethod: (id: string) => void;
}

const DemoButton: FunctionComponent<DemoButtonProps> = (
    props: DemoButtonProps
) => (
    <div
        id={props.demoMethod.name}
        className="demoButton"
        onClick={props.demoMethod.bind(this, props.demoMethod.name)}
    >
        <img src="/img/cursor.svg" />
    </div>
);
export default DemoButton;
