import { Path2D } from "@napi-rs/canvas";

globalThis.Path2D = Path2D as unknown as typeof globalThis.Path2D;
