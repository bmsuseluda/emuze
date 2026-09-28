import sdl from "@kmamal/sdl";
import sdl3 from "@kmamal/sdl3";
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
    log("debug", "hid object", hidDevices.at(0));
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
    const nameOsSpecific = getNameOsSpecific(joystick, controller);
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

export const getControllersSdl3 = () => getControllers(sdl3.joystick.devices);

export const getControllers = (
  joysticks: Sdl.Joystick.Device[] = sdl.joystick.devices,
) => {
  const emuzeControllers: EmuzeController[] = [];

  let steamHandleIndex = 0;

  const joystickSorted = sortSteamDeckLast(joysticks);

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
  joystick: Sdl.Joystick.Device,
  controller: Sdl.Controller.Device,
) => {
  if (isWindows() && isXinputController(controller.type)) {
    return `XInput Controller`;
  }

  if (isSteamOs()) {
    return joystick.name!;
  }

  return controller.name;
};

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
      controller.vendor === steamDeckJoystick.vendor ||
      controller.name === "Steam Virtual Gamepad"
    );
  } catch {
    return false;
  }
};
