import type { EmuzeButtonId } from "../../../../types/gamepad.js";

export type AresButtonId =
  | "Pad.Up"
  | "Pad.Down"
  | "Pad.Left"
  | "Pad.Right"
  | "Select"
  | "Start"
  | "A..South"
  | "B..East"
  | "X..West"
  | "Y..North"
  | "L-Bumper"
  | "R-Bumper"
  | "L-Trigger"
  | "R-Trigger"
  | "L-Stick..Click"
  | "R-Stick..Click"
  | "L-Up"
  | "L-Down"
  | "L-Left"
  | "L-Right"
  | "R-Up"
  | "R-Down"
  | "R-Left"
  | "R-Right"
  | "Rumble";

export const aresButtonIds = {
  dpadUp: "Pad.Up",
  dpadDown: "Pad.Down",
  dpadLeft: "Pad.Left",
  dpadRight: "Pad.Right",
  back: "Select",
  start: "Start",
  a: "A..South",
  b: "B..East",
  x: "X..West",
  y: "Y..North",
  leftShoulder: "L-Bumper",
  rightShoulder: "R-Bumper",
  leftTrigger: "L-Trigger",
  rightTrigger: "R-Trigger",
  leftStick: "L-Stick..Click",
  rightStick: "R-Stick..Click",
  leftStickUp: "L-Up",
  leftStickDown: "L-Down",
  leftStickLeft: "L-Left",
  leftStickRight: "L-Right",
  rightStickUp: "R-Up",
  rightStickDown: "R-Down",
  rightStickLeft: "R-Left",
  rightStickRight: "R-Right",
} satisfies Partial<Record<EmuzeButtonId, AresButtonId>>;

export type GamepadGroupId = "Axis" | "HAT" | "Button";
export type GamepadQualifier = "Hi" | "Lo";

export interface PhysicalGamepadButton {
  deviceId: string;
  groupId: GamepadGroupId;
  inputId?: string;
  qualifier?: GamepadQualifier;
}

export interface VirtualGamepad {
  gamepadIndex: number;
  buttonId: AresButtonId;
}
