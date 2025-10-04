import type { EmuzeButtonId } from "../../../../types/gamepad.js";

export type PpssppButtonId = Exclude<
  EmuzeButtonId,
  | "rightStickUp"
  | "rightStickDown"
  | "rightStickLeft"
  | "rightStickRight"
  | "leftStick"
  | "rightStick"
>;
