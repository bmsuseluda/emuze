import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import type { ParamToReplace } from "../../configFile.js";

export const keyboardConfig: ParamToReplace[] = [
  { keyValue: "port1_driver = 'usb-xbox-gamepad'" },
  { keyValue: "port1 = 'keyboard'" },
];

const xemuButtonIds = {
  dpadUp: "dpad_up",
  dpadLeft: "dpad_left",
  dpadDown: "dpad_down",
  dpadRight: "dpad_right",
  a: "a",
  b: "b",
  x: "x",
  y: "y",
  back: "back",
  start: "start",
  leftShoulder: "black",
  rightShoulder: "white",
  leftStick: "lstick_btn",
  rightStick: "rstick_btn",
  leftStickUp: "lstick_up",
  leftStickDown: "lstick_down",
  leftStickLeft: "lstick_left",
  leftStickRight: "lstick_right",
  leftTrigger: "ltrigger",
  rightStickUp: "rstick_up",
  rightStickDown: "rstick_down",
  rightStickLeft: "rstick_left",
  rightStickRight: "rstick_right",
  rightTrigger: "rtrigger",
} satisfies Partial<Record<EmuzeButtonId, string>>;

export const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(xemuButtonIds).map(([sdlButtonId, xemuButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];
    const sdlScancode = sdl.keyboard.SCANCODE[sdlScancodeName];

    return {
      keyValue: `${xemuButtonId} = ${sdlScancode}`,
    };
  });
