import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";

export const getKeyboardMapping = (buttonId: EmuzeButtonId) =>
  getKeyboardKey(keyboardMapping[buttonId]);

export const getKeyboardKey = (
  keyboardScancodeName: Sdl.Keyboard.ScancodeNames,
) => `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
