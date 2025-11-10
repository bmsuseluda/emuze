import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { getPlayerIndexArray } from "../../../../types/gamepad.js";
import type { PortConfig } from "./config.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { mameButtonIds } from "./types.js";

const mameButtonMapping = {
  // TODO: Check if hat is correct on all controllers
  dpadUp: "HAT1UP",
  dpadDown: "HAT1DOWN",
  dpadLeft: "HAT1LEFT",
  dpadRight: "HAT1RIGHT",
  leftStickUp: "YAXIS_UP_SWITCH",
  leftStickDown: "YAXIS_DOWN_SWITCH",
  //   TODO: check real key
  leftStickLeft: "YAXIS_UP_SWITCH",
  //   TODO: check real key
  leftStickRight: "JOYSTICKLEFT_RIGHT",
  a: "BUTTON1",
  b: "BUTTON2",
  x: "BUTTON3",
  y: "BUTTON4",
  leftShoulder: "BUTTON5",
  rightShoulder: "BUTTON6",
  //   TODO: check what if there is no analog?
  leftTrigger: "SLIDER1_NEG_SWITCH",
  //   TODO: check what if there is no analog?
  rightTrigger: "SLIDER2_NEG_SWITCH",
  back: "SELECT",
  start: "START",
  leftStick: "BUTTON7",
  rightStick: "BUTTON8",
  //   TODO: check real key
  rightStickUp: "JOYSTICKRIGHT_UP",
  //   TODO: check real key
  rightStickDown: "JOYSTICKRIGHT_DOWN",
  //   TODO: check real key
  rightStickLeft: "JOYSTICKRIGHT_LEFT",
  //   TODO: check real key
  rightStickRight: "JOYSTICKRIGHT_RIGHT",
} satisfies Record<EmuzeButtonId, string>;

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number): PortConfig[] => {
    log("debug", "gamepad", { sdlIndex, sdlDevice });

    // TODO: should i check the controller mapping?

    return Object.entries(mameButtonIds).map(
      ([emuzeButtonId, mameButtonId]) => [
        `P${playerIndexArray[sdlIndex] + 1}_${mameButtonId}`,
        `JOYCODE_${sdlIndex + 1}_${mameButtonMapping[emuzeButtonId as EmuzeButtonId]}`,
      ],
    );
  };

export const getVirtualGamepads = (): PortConfig[] => {
  const gamepads = sdl.joystick.devices;

  if (gamepads.length > 0) {
    const playerIndexArray = getPlayerIndexArray(gamepads);
    return gamepads.flatMap(getVirtualGamepad(playerIndexArray));
  }

  return keyboardConfig;
};
