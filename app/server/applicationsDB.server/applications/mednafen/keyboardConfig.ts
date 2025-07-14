import type { Sdl } from "@bmsuseluda/sdl";
import sdl from "@bmsuseluda/sdl";

export const getKeyboardKey = (
  keyboardScancodeName: Sdl.Keyboard.ScancodeNames,
) => `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
