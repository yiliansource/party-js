// import Colour from "./colour";
// import { invlerp } from "../systems/math";

// /**
//  * Represents a key on a gradient.
//  */
// export interface GradientKey {
//     /**
//      * The colour of the key.
//      */
//     colour: Colour;
//     /**
//      * The position of the key.
//      */
//     time: number;
// }

// /**
//  * Represents a gradient that can be used to interpolate between multiple colours.
//  */
// export default class Gradient {
//     /**
//      * Creates a new gradient from the specified keys.
//      */
//     constructor(...values: GradientKey[]) {
//         if (values.length === 0) {
//             throw new Error("Gradients require atleast one key.");
//         }
//         this.values = values;
//     }

//     private values: GradientKey[] = [];

//     /**
//      * Evaluates the gradient at the given time.
//      */
//     public evaluate(time: number) {
//         if (this.values.length === 0) {
//             throw new Error("Attempt to evaluate gradient with no keys.");
//         }

//         if (this.values.length === 1) {
//             // the gradient only contains one key, is therefore solid.
//             return this.values[0].colour;
//         }

//         let ascendingKeys = this.values.sort((a, b) => a.time - b.time);
//         let upperKeyIndex = ascendingKeys.findIndex(g => g.time >= time);

//         if (upperKeyIndex === -1) {
//             // the requested time exceeds the last key, therefore return the last solid key.
//             return ascendingKeys[ascendingKeys.length - 1].colour; 
//         }
//         if (upperKeyIndex === 0) {
//             // the requested time comes before any key, therefore return the first solid key.
//             return ascendingKeys[0].colour;
//         }

//         // find the bounding keys and inversely interpolate to figure out the point we need to sample between them.
//         let lowerKey = ascendingKeys[upperKeyIndex - 1];
//         let upperKey = ascendingKeys[upperKeyIndex];
//         let t = invlerp(lowerKey.time, upperKey.time, time);

//         return lowerKey.colour.mix(upperKey.colour, t);
//     }

//     /**
//      * Returns a solid gradient from the given colour.
//      */
//     public static solid(colour: Colour) {
//         return new Gradient({ colour, time: 0.5 });
//     }
    
//     /**
//      * Returns a gradient with evenly spaced keys from the given colours.
//      */
//     public static simple(...colours: Colour[]) {
//         const step = 1 / (colours.length - 1);
//         return new Gradient(...colours.map((c, i) => ({
//             colour: c,
//             time: i * step
//         })));
//     }
// }