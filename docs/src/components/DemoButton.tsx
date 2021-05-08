import { Source } from "party-js/lib/particles/options/emissionOptions";
import React, { FunctionComponent, useRef } from "react";

interface DemoButtonProps {
    demoMethod: (source: Source) => void;
}

const DemoButton: FunctionComponent<DemoButtonProps> = ({
    demoMethod,
}: DemoButtonProps) => {
    const elementReference = useRef(null);
    return (
        <div
            ref={elementReference}
            id={demoMethod.name}
            className="demoButton"
            onClick={() => demoMethod.call(null, elementReference.current)}
        >
            <img src="/img/cursor.svg" />
        </div>
    );
};
export default DemoButton;
