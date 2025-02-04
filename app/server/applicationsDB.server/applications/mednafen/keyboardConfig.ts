import type { Sdl } from "@bmsuseluda/node-sdl";
import sdl from "@bmsuseluda/node-sdl";

export const getKeyboardKey = (
  keyboardScancodeName: Sdl.Keyboard.ScancodeNames,
) => `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
