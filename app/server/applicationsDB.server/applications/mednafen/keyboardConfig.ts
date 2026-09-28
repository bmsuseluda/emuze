import type { Sdl } from "@kmamal/sdl3";
import sdl from "@kmamal/sdl3";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";

export const getKeyboardMapping = (buttonId: EmuzeButtonId) =>
  getKeyboardKey(keyboardMapping[buttonId]);

export const getKeyboardKey = (
  keyboardScancodeName: Sdl.Keyboard.ScancodeNames,
) => `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
