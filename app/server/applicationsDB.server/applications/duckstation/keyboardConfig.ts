import { EOL } from "node:os";
import {
  keyboardMapping,
  type EmuzeButtonId,
} from "../../../../types/gamepad.js";
import type { DuckStationButtonId } from "./types.js";
import type { Sdl } from "@kmamal/sdl";

export const scancodes = {
  T: "T",
  G: "G",
  F: "F",
  H: "H",
  BACKSPACE: "Backspace",
  RETURN: "Return",
  J: "J",
  K: "K",
  U: "U",
  I: "I",
  L: "L",
  O: "O",
  "8": "8",
  "9": "9",
  X: "X",
  Y: "Y",
  P: "P",
  E: "E",
  V: "V",
  RSHIFT: "Shift",
  W: "W",
  A: "A",
  S: "S",
  D: "D",
  UP: "Up",
  DOWN: "Down",
  LEFT: "Left",
  RIGHT: "Right",
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, string>>;

const duckstationButtonIds = {
  dpadUp: "Up",
  dpadDown: "Down",
  dpadLeft: "Left",
  dpadRight: "Right",
  leftStickUp: "LUp",
  leftStickDown: "LDown",
  leftStickLeft: "LLeft",
  leftStickRight: "LRight",
  a: "Cross",
  b: "Circle",
  x: "Square",
  y: "Triangle",
  leftShoulder: "L1",
  rightShoulder: "R1",
  leftTrigger: "L2",
  rightTrigger: "R2",
  back: "Select",
  start: "Start",
  leftStick: "L3",
  rightStick: "R3",
  rightStickUp: "RUp",
  rightStickDown: "RDown",
  rightStickLeft: "RLeft",
  rightStickRight: "RRight",
} satisfies Record<EmuzeButtonId, DuckStationButtonId>;

export const keyboardConfig = [
  "[Pad1]",
  "Type = AnalogController",
  ...Object.entries(duckstationButtonIds).map(
    ([sdlButtonId, duckstationButtonId]) =>
      `${duckstationButtonId} = Keyboard/${scancodes[keyboardMapping[sdlButtonId as EmuzeButtonId]]}`,
  ),
  "Analog = Keyboard/Q",
  "",
  "",
  "",
].join(EOL);
