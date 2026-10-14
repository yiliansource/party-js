import { createLighting, type LightingFn } from "party-js";

export const confettiLighting = createLighting({ ambient: 0.5, peak: 1.5 });

export const noLighting: LightingFn = (c) => c;
