import { Rect } from "../../../components/rect";
import { Variation } from "../../../systems/customization";

export interface ShapeOptions {
    source: Rect;
    angle: Variation<number>;
}

export function getDefaultShapeOptions(): ShapeOptions {
    return {
        source: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        },
        angle: 0,
    };
}
