import type { Sdl } from "@kmamal/sdl";
import type { SdlType } from "../../../../types/sdl.js";

export const getKeyboardKey =
  (sdl: SdlType) => (keyboardScancodeName: Sdl.Keyboard.ScancodeNames) =>
    `keyboard 0x0 ${sdl.keyboard.SCANCODE[keyboardScancodeName]}`;
