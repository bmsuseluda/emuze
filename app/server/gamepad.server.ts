import sdl from "@kmamal/sdl";
import type { Sdl } from "@kmamal/sdl";
import { isWindows } from "./operationsystem.server.js";
import { isController, isXinputController } from "../types/gamepad.js";

export const getJoystickFromController = (controller: Sdl.Controller.Device) =>
  sdl.joystick.devices.find(({ id }) => controller.id === id);

export const getControllerFromJoystick = (joystick: Sdl.Joystick.Device) =>
  sdl.controller.devices.find(({ id }) => joystick.id === id);

export const getGamepadName = (
  gamepad: Sdl.Controller.Device | Sdl.Joystick.Device,
) => {
  if (
    isWindows() &&
    isController(gamepad) &&
    isXinputController(gamepad.type)
  ) {
    return `XInput Controller`;
  } else {
    return gamepad.name!;
  }
};

/**
 * check all devices until sdlIndex (current index) for name. count how much and return accordingly
 *
 * @return number starts with 0
 */
export const getSdlNameIndex = (
  name: string,
  sdlIndex: number,
  devices: (Sdl.Joystick.Device | Sdl.Controller.Device)[],
) => {
  let nameCount = 0;
  for (let index = 0; index < sdlIndex; index++) {
    const device = devices[index];
    if (getGamepadName(device) === name) {
      nameCount++;
    }
  }

  return nameCount;
};
