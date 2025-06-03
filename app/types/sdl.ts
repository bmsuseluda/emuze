import type { Sdl } from "@kmamal/sdl";

export interface SdlType {
  controller: Sdl.Controller.Module;
  keyboard: Sdl.Keyboard.Module;
  joystick: Sdl.Joystick.Module;
}
