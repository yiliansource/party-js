import { Source } from "party-js/src/util";
import React, { FunctionComponent, useRef } from "react";

interface DemoButtonProps {
    demoMethod: (source: Source) => void;
}

const DemoButton: FunctionComponent<DemoButtonProps> = ({
    demoMethod,
}: DemoButtonProps) => {
    const buttonElement: React.MutableRefObject<HTMLDivElement> = useRef(null);

    return (
        <div
            ref={buttonElement}
            id={demoMethod.name + "-button"}
            className="demoButton"
            onClick={() => demoMethod(buttonElement.current)}
        >
            <img src="/img/cursor.svg" />
        </div>
    );
};
export default DemoButton;
