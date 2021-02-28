import { Scene } from "./app/scene";

if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error(
        "It seems like you are trying to run party.js in a non-browser environment, which is not supported."
    );
}

export * from "./app/globals";
export * from "./generators";

export const scene = new Scene();
