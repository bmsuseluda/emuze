import type { EmuzeButtonId } from "../../../../types/gamepad.js";

export type RmgButtonId =
  | "A"
  | "B"
  | "Start"
  | "AnalogStickUp"
  | "AnalogStickDown"
  | "AnalogStickLeft"
  | "AnalogStickRight"
  | "CButtonUp"
  | "CButtonDown"
  | "CButtonLeft"
  | "CButtonRight"
  | "LeftTrigger"
  | "RightTrigger"
  | "ZTrigger"
  | "DpadUp"
  | "DpadDown"
  | "DpadLeft"
  | "DpadRight";

export const rmgButtonIds = {
  DpadUp: ["dpadUp"],
  DpadDown: ["dpadDown"],
  DpadLeft: ["dpadLeft"],
  DpadRight: ["dpadRight"],
  Start: ["start"],
  A: ["a"],
  B: ["x"],
  LeftTrigger: ["leftShoulder"],
  RightTrigger: ["rightShoulder"],
  ZTrigger: ["leftTrigger"],
  AnalogStickUp: ["leftStickUp"],
  AnalogStickDown: ["leftStickDown"],
  AnalogStickLeft: ["leftStickLeft"],
  AnalogStickRight: ["leftStickRight"],
  CButtonUp: ["rightStickUp"],
  CButtonDown: ["rightStickDown", "b"],
  CButtonLeft: ["rightStickLeft", "y"],
  CButtonRight: ["rightStickRight"],
} satisfies Partial<Record<RmgButtonId, EmuzeButtonId[]>>;

export type ButtonDetailsFunction = (
  emuzeButtonId: EmuzeButtonId,
) => string | number | undefined;

export const mapAndJoinEmuzeButtonIds = (
  emuzeButtonIds: EmuzeButtonId[],
  buttonDetailsFunction: ButtonDetailsFunction,
) =>
  emuzeButtonIds
    .map((emuzeButtonId) => buttonDetailsFunction(emuzeButtonId))
    .join(";");
