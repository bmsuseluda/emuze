import type { AresButtonId } from "./types.js";
import { isWindows } from "../../../operationsystem.server.js";
import type { Sdl } from "@kmamal/sdl";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";

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

type Scancode = keyof typeof scancodes;
export const scancodes = {
  F1: 1,
  F2: 2,
  F3: 3,
  T: 54,
  G: 41,
  F: 40,
  H: 42,
  BACKSPACE: 28,
  RETURN: isWindows() ? 91 : 89,
  J: 44,
  K: 45,
  U: 55,
  I: 43,
  L: 46,
  O: 49,
  "8": 24,
  "9": 25,
  X: 58,
  RSHIFT: 96,
  W: 57,
  S: 53,
  A: 35,
  D: 38,
  UP: 84,
  DOWN: 85,
  LEFT: 86,
  RIGHT: 87,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

export const getKeyboardKey = (scancode: Scancode) =>
  `0x1/0/${scancodes[scancode]}`;

const getVirtualKeyboardKey = (
  buttonId: AresButtonId,
  ...physicalKeyboardKeys: (Scancode | null)[]
) => {
  const physicalKeyboardKeyStrings = physicalKeyboardKeys
    .filter(Boolean)
    .map((key) => key && getKeyboardKey(key));

  if (physicalKeyboardKeyStrings.length > 0) {
    const virtualGamepadString = [`VirtualPad1`, buttonId].join("/");

    return [
      "--setting",
      `${virtualGamepadString}=${physicalKeyboardKeyStrings.join(";")}`,
    ];
  }

  return [];
};

export const getKeyboard = () =>
  Object.entries(aresButtonIds).map(([sdlButtonId, aresButtonId]) =>
    getVirtualKeyboardKey(
      aresButtonId,
      keyboardMapping[sdlButtonId as EmuzeButtonId],
    ),
  );
