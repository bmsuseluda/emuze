import sdl from "@kmamal/sdl";
import type { Sdl } from "@kmamal/sdl";
import { isSteamOs, isWindows } from "./operationsystem.server.js";
import {
  createSdlMappingObject,
  isXinputController,
  SdlButtonMapping,
  sortSteamDeckLast,
  steamDeckJoystick,
} from "../types/gamepad.js";
import HID from "node-hid";
import { log } from "./debug.server.js";

export const steamInputHandleFromHid = "Microsoft X-Box 360 pad";

export const getDeviceNameFromHid = (
  controller: Sdl.Controller.Device,
  steamHandleIndex: number,
) => {
  if (isSteamHandle(controller)) {
    return `${steamInputHandleFromHid} ${steamHandleIndex}`;
  }

  const { vendor, product } = controller;
  if (vendor && product) {
    const hidDevices = HID.devices(vendor, product);
    log("debug", "hid path", hidDevices.at(0)?.path);
    return hidDevices.at(0)?.product;
  }

  return undefined;
};

export interface EmuzeController {
  id: number;
  name: string;
  joystickName: string;
  nameOsSpecific: string;
  hidName?: string;
  type: Sdl.Controller.ControllerType;
  guid: string;
  vendor: number;
  product: number;
  player: number;
  mapping: string;
  mappingObject: SdlButtonMapping;
  hasSteamHandle: boolean;
  sdlJoystick: Sdl.Joystick.Device;
  sdlController: Sdl.Controller.Device;
  serialNumber: string;
  path: string | null;
}

export const steamHandleGUIDs = [
  "030079f6de280000ff11000001000000",
  "0300b836de280000ff11000001000000",
  "0300f837de280000ff11000001000000",
  "030039f7de280000ff11000001000000",
  "03007835de280000ff11000001000000",
];

const isNumber = (value?: number | null): value is number =>
  value !== null && typeof value !== "undefined" && Number.isInteger(value);

export const createEmuzeController = ({
  controller,
  joystick,
  playerIndex,
  hasSteamHandle,
  steamGUID,
  hidName,
  serialNumber,
}: {
  controller: Sdl.Controller.Device;
  joystick: Sdl.Joystick.Device;
  playerIndex: number;
  hasSteamHandle: boolean;
  steamGUID: string | null;
  hidName?: string;
  serialNumber: string;
}) => {
  const {
    id,
    guid,
    name: joystickName,
    player,
    product,
    vendor,
    path,
  } = joystick;
  const { name, mapping, type } = controller;

  if (
    guid &&
    joystickName &&
    isNumber(product) &&
    isNumber(vendor) &&
    isNumber(player) &&
    mapping
  ) {
    const nameOsSpecific = getNameOsSpecific(name, joystickName, type);
    return {
      id,
      guid: steamGUID || guid,
      name,
      joystickName,
      nameOsSpecific,
      type,
      hidName,
      product,
      vendor,
      player: playerIndex,
      mapping,
      mappingObject: createSdlMappingObject(mapping),
      hasSteamHandle,
      serialNumber,
      path,
      sdlJoystick: joystick,
      sdlController: controller,
    };
  }
};

const getSteamGUID = (hasSteamHandle: boolean, steamHandleIndex: number) => {
  if (hasSteamHandle) {
    const steamGUID = steamHandleGUIDs.at(steamHandleIndex) || null;
    return steamGUID;
  }

  return null;
};

/**
 * Returns Array of EmuzeControllers.
 * - Iterate through SDL.controllers as a base
 * - filter out controller without guid, mapping or player
 * - add jostickname and hidname
 * - sort controller that Steam Deck Controller is last
 * - if a controller has a steam handle, replace GUID with the next from steamHandleGUIDs
 *
 * TODO: add name index?
 * TODO: add sdl name index?
 * TODO: replace player with index?
 * TODO: add more steam handle GUIDs
 * TODO: do lightguns have a controller in sdl as well?
 * TODO: overwrite guid in sdlJoystick and sdlController too?
 */
export const getControllers = () => {
  const emuzeControllers: EmuzeController[] = [];

  let steamHandleIndex = 0;

  const joystickSorted = sortSteamDeckLast(sdl.joystick.devices);

  let playerIndex = 0;
  joystickSorted.forEach((joystick) => {
    const controller = getControllerFromJoystick(joystick);
    if (controller) {
      const hasSteamHandle = isSteamHandle(controller);
      const hidName = getDeviceNameFromHid(controller, steamHandleIndex);
      const steamGUID = getSteamGUID(hasSteamHandle, steamHandleIndex);
      const serialNumber = sdl.controller.openDevice(controller).serialNumber;

      const emuzeController = createEmuzeController({
        controller,
        joystick,
        playerIndex,
        hasSteamHandle,
        steamGUID,
        hidName,
        serialNumber,
      });

      if (hasSteamHandle) {
        steamHandleIndex++;
      }

      if (emuzeController) {
        emuzeControllers.push(emuzeController);
        playerIndex++;
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

const getNameOsSpecific = (
  controllerName: string,
  joystickName: string,
  type: Sdl.Controller.ControllerType,
) => {
  if (isWindows() && isXinputController(type)) {
    return `XInput Controller`;
  } else if (isSteamOs()) {
    return joystickName;
  } else {
    return controllerName;
  }
};

/**
 * ares: guid
 * azahar: guid
 * cemu: controller name and guid getNameIndex
 * dolphin: getGamepadName getSdlNameIndex
 * dosbox: hidName
 * duckstation: player
 * eden: guid getSdlGuidIndex
 * flycast: player
 * mame: auto
 * mednafen: hidName and controller type
 * melonds: joystick index
 * pcsx2: player
 * ppsspp: map several controllers
 * rmg: getGamepadName getNameIndex
 * rpcs3: getGamepadName getSdlNameIndex
 * ryujinx: guid getNameIndex
 * scummvm: auto
 * xemu: guid and index
 */

export const getJoystickFromController = (
  controller: Sdl.Controller.Device,
): Sdl.Joystick.Device =>
  sdl.joystick.devices.find(({ id }) => controller.id === id)!;

export const getControllerFromJoystick = (joystick: Sdl.Joystick.Device) =>
  sdl.controller.devices.find(({ id }) => joystick.id === id);

/**
 * check all devices until sdlIndex (current index) for name. count how much and return accordingly
 *
 * @returns number starts with 0
 */
export const getSdlNameIndex = (
  name: string,
  sdlIndex: number,
  devices: EmuzeController[],
) => {
  let nameCount = 0;
  for (let index = 0; index < sdlIndex; index++) {
    const device = devices[index];
    if (device.nameOsSpecific === name) {
      nameCount++;
    }
  }

  return nameCount;
};

export type DetectSdlGuidIndex = (guid: string, sdlIndex: number) => number;

/**
 * check all devices until sdlIndex (current index) for GUID. count how much and return accordingly
 *
 * @returns number starts with 0
 */
export const getSdlGuidIndex =
  (
    devices: EmuzeController[],
    normalizeGuid: (guid: string) => string = (guid: string) => guid,
  ): DetectSdlGuidIndex =>
  (guid, sdlIndex) => {
    let nameCount = 0;
    for (let index = 0; index < sdlIndex; index++) {
      const device = devices[index];
      if (normalizeGuid(device.guid) === normalizeGuid(guid)) {
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
