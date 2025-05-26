import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";

export const getKeyboardKey = (
  keyboardScancodeName: Sdl.Keyboard.ScancodeNames,
) => `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
