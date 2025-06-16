import type { Sdl } from "@kmamal/sdl";

export interface SdlType {
  controller: Sdl.Controller.Module;
  keyboard: Sdl.Keyboard.Module;
  joystick: Sdl.Joystick.Module;
}

export interface GamepadData {
  gamepadType: GamepadType;
  buttonId: ButtonId;
  eventType: "buttonDown" | "buttonUp";
}

export type GamepadType = "Nintendo" | "XBox" | "PlayStation";

export type ButtonId =
  | "dpadUp"
  | "dpadDown"
  | "dpadLeft"
  | "dpadRight"
  | "a"
  | "b"
  | "x"
  | "y"
  | "guide"
  | "back"
  | "start"
  | "leftStick"
  | "rightStick"
  | "leftShoulder"
  | "rightShoulder"
  | "paddle1"
  | "paddle2"
  | "paddle3"
  | "paddle4"
  | "leftTrigger"
  | "rightTrigger"
  | "leftStickUp"
  | "leftStickDown"
  | "leftStickLeft"
  | "leftStickRight"
  | "rightStickUp"
  | "rightStickDown"
  | "rightStickLeft"
  | "rightStickRight";

export const getGamepadButtonEventName = (buttonId: ButtonId) =>
  `gamepadonbutton${buttonId.toLowerCase()}press`;
