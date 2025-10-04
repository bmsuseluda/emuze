import type { Sdl } from "@kmamal/sdl";
import type { PpssppButtonId } from "./types.js";
import { keyboardMapping } from "../../../../types/gamepad.js";

const keyboardId = 1;

type Scancode = keyof typeof scancodes;
export const scancodes = {
  F1: 131,
  F2: 132,
  F3: 133,
  F11: 141,
  T: 48,
  G: 35,
  F: 34,
  H: 36,
  BACKSPACE: 67,
  RETURN: 66,
  J: 38,
  K: 39,
  U: 49,
  I: 37,
  L: 40,
  O: 43,
  X: 58,
  RSHIFT: 96,
  W: 51,
  S: 47,
  A: 29,
  D: 32,
  "8": 0,
  "9": 0,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

export const getKeyboardKey = (scancode: Scancode) =>
  `${keyboardId}-${scancodes[scancode]}`;

export const getKeyboardKeyForGamepadButton = (buttonId: PpssppButtonId) =>
  getKeyboardKey(keyboardMapping[buttonId]);
