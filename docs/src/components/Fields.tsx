import React, { FunctionComponent } from "react";

interface FieldProps {
    name: string;
    type: string;
    defaultValue: string;
    description?: string;
}

export const FieldList: FunctionComponent = ({ children }) => (
    <div>{children}</div>
);

export const FieldItem: FunctionComponent<FieldProps> = ({
    name,
    type,
    defaultValue,
    description,
}: FieldProps) => (
    <div>
        <h3>
            <code>{name}</code>
        </h3>
        <ul>
            {type && (
                <li>
                    Type: <code>{type}</code>
                </li>
            )}
            {defaultValue && (
                <li>
                    Default: <code>{defaultValue}</code>
                </li>
            )}
        </ul>
        {description && <p>{description}</p>}
    </div>
);
