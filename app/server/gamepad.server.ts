import sdl from "@kmamal/sdl";
import type { Sdl } from "@kmamal/sdl";
import { isWindows } from "./operationsystem.server.js";
import {
  createSdlMappingObject,
  isController,
  isXinputController,
  SdlButtonMapping,
  sortSteamDeckLast,
  steamDeckJoystick,
} from "../types/gamepad.js";
import HID from "node-hid";
import { log } from "./debug.server.js";

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

// TODO: if no hid devices where find, will it be a steam input device?
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

export interface EmuzeController {
  id: number;
  name: string;
  joystickName: string;
  hidName?: string;
  type?: Sdl.Controller.ControllerType;
  guid: string;
  vendor: number;
  product: number;
  player: number;
  mapping: string;
  mappingObject: SdlButtonMapping;
  hasSteamHandle: boolean;
  sdlJoystick: Sdl.Joystick.Device;
  sdlController: Sdl.Controller.Device;
}

const steamHandleGUIDs = [
  "030079f6de280000ff11000001000000",
  "0300b836de280000ff11000001000000",
  "0300f837de280000ff11000001000000",
  "030039f7de280000ff11000001000000",
];

/**
 * Returns Array of EmuzeControllers.
 * - Iterate through SDL.controllers as a base
 * - filter out controller without guid, mapping or player
 * - add jostickname and hidname
 * - sort controller that Steam Deck Controller is last
 * - if a controller has a steam handle, replace GUID with the next from steamHandleGUIDs
 *
 * TODO: add getGamepadName?
 * TODO: add name index?
 * TODO: replace player with index?
 * TODO: add more steam handle GUIDs
 */
export const getControllers = () => {
  const emuzeControllers: EmuzeController[] = [];

  let steamHandleIndex = 0;
  const getSteamGUID = (hasSteamHandle: boolean) => {
    if (hasSteamHandle) {
      const steamGUID = steamHandleGUIDs.at(steamHandleIndex) || null;
      steamHandleIndex++;
      return steamGUID;
    }

    return null;
  };

  const isNumber = (value?: number | null): value is number =>
    value !== null && typeof value !== "undefined" && Number.isInteger(value);

  const joystickSorted = sdl.joystick.devices.toSorted(sortSteamDeckLast);

  joystickSorted.forEach((joystick) => {
    const controller = getControllerFromJoystick(joystick);
    if (controller) {
      const {
        id,
        guid,
        name: joystickName,
        player,
        product,
        vendor,
      } = joystick;
      const { name, mapping } = controller;
      const hidName = getDeviceNameFromHid(joystick);
      const hasSteamHandle = isSteamHandle(controller);
      const steamGUID = getSteamGUID(hasSteamHandle);

      if (
        guid &&
        joystickName &&
        isNumber(product) &&
        isNumber(vendor) &&
        isNumber(player) &&
        mapping
      ) {
        emuzeControllers.push({
          id,
          guid: steamGUID || guid,
          name,
          joystickName,
          hidName,
          product,
          vendor,
          player,
          mapping,
          mappingObject: createSdlMappingObject(mapping),
          hasSteamHandle,
          sdlJoystick: joystick,
          sdlController: controller,
        });
      } else {
        log(
          "debug",
          "controller is not suitable",
          controller,
          joystick,
          hidName,
          hasSteamHandle,
          steamGUID,
        );
      }
    }
  });

  return emuzeControllers;
};

/**
 * ares: guid
 * azahar: guid
 * cemu: controller name and guid
 * dolphin: getGamepadName
 * dosbox: hidName
 * duckstation: player
 * eden: guid
 * flycast: auto
 * mame: auto
 * mednafen: hidName and controller type
 * melonds: joystick index
 * pcsx2: player
 * ppsspp: map several controllers
 * rmg: getGamepadName
 * rpcs3: getGamepadName
 * ryujinx: guid and index
 * scummvm: auto
 * xemu: guid and index
 */

export const getJoystickFromController = (
  controller: Sdl.Controller.Device,
): Sdl.Joystick.Device =>
  sdl.joystick.devices.find(({ id }) => controller.id === id)!;

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
 * @returns number starts with 0
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

export const isSteamHandle = (controller: Sdl.Controller.Device): boolean => {
  try {
    return (
      !!sdl.controller.openDevice(controller).steamHandle ||
      controller.vendor === steamDeckJoystick.vendor
    );
  } catch {
    return false;
  }
};
