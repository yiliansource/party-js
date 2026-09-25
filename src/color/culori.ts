import { modeHsl, modeOklab, modeRgb, useMode } from "culori/fn";
import type { ConvertFn } from "culori/require";

export const toOklab: ConvertFn<"oklab"> = useMode(modeOklab);

useMode(modeRgb);
useMode(modeHsl);
