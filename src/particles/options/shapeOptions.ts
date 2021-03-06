import { Rect } from "../../components/rect";
import { Variation } from "../../systems/customization";

/**
 * Holds a set of options to determine the area and direction that particles are spawned in.
 */
export interface ShapeOptions {
    /**
     * The rectangular area that particles will be spawned from.
     * The point inside the rectangle will be determined randomly.
     *
     * @defaultValue A zero-sized rect at (0, 0).
     */
    source: Rect;
    /**
     * The angle that particles will be emitted at, in degrees.. This is used to, for example,
     * give the particles a particular amount of initial force in a direction.
     *
     * @defaultValue 0
     */
    angle: Variation<number>;
}

/**
 * Returns the default set of shape options.
 */
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
