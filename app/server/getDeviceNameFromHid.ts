import { type Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import HID from "node-hid";
import { getControllerFromJoystick, isSteamHandle } from "./gamepad.server.js";

export const steamInputHandleFromHid = "Microsoft X-Box 360 pad";

export const getSteamInputHandleIndex = (gamepad: Sdl.Controller.Device) => {
  const gamepads = sdl.controller.devices;
  let steamInputHandleIndex = 0;

  for (const gamepadToCheck of gamepads) {
    if (gamepadToCheck === gamepad) {
      break;
    }
    if (isSteamHandle(gamepadToCheck)) {
      steamInputHandleIndex += 1;
    }
  }

  return steamInputHandleIndex;
};

export const getDeviceNameFromHid = (joystick: Sdl.Joystick.Device) => {
  const { vendor, product } = joystick;
  if (vendor && product) {
    const controller = getControllerFromJoystick(joystick);
    if (controller && isSteamHandle(controller)) {
      return `${steamInputHandleFromHid} ${getSteamInputHandleIndex(controller)}`;
    }

    const hidDevices = HID.devices(vendor, product);
    return hidDevices.at(0)?.product;
  }
  return undefined;
};
