import {
  keyboardMapping,
  type EmuzeButtonId,
} from "../../../../types/gamepad.js";
import type { PortConfig } from "./config.js";
import { mameButtonIds } from "./types.js";

export const keyboardConfig: PortConfig[] = Object.entries(mameButtonIds).map(
  ([emuzeButtonId, mameButtonId]) => [
    `P1_${mameButtonId}`,
    `KEYCODE_${keyboardMapping[emuzeButtonId as EmuzeButtonId]}`,
  ],
);
