import { Variation } from "../../../systems/customization";

export interface EmissionOptions {
    rate: number;
    bursts: Burst[];
}

export interface Burst {
    time: number;
    count: Variation<number>;
    probability?: number;
}

export function getDefaultEmissionOptions(): EmissionOptions {
    return {
        rate: 10,
        bursts: [],
    };
}
