import type { Sdl } from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import sdl from "@kmamal/sdl";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getAxis,
  getButtonIndex,
  isAnalog,
  isDpadHat,
  isSteamDeckController,
  sortSteamDeckLast,
} from "../../../../types/gamepad.js";
import { getControllerFromJoystick } from "../../../gamepad.server.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { DosboxButtonId } from "./types.js";
import {
  AnalogType,
  AnalogValue,
  ButtonValue,
  HatType,
  HatValue,
} from "./config.js";
import { getDeviceNameFromHid } from "../../../getDeviceNameFromHid.js";

export const getGamepad = () => {
  const gamepads = sdl.joystick.devices;

  if (gamepads.length === 1) {
    return gamepads[0];
  }

  if (gamepads.length > 1) {
    if (isSteamDeckController(gamepads[0])) {
      return gamepads[1];
    } else {
      return gamepads[0];
    }
  }
  return null;
};

// TODO: remove portId
const dosboxButtonIds = {
  bind_port_1_up: "dpup",
  bind_port_1_down: "dpdown",
  bind_port_1_left: "dpleft",
  bind_port_1_right: "dpright",
  bind_port_1_a: "b",
  bind_port_1_b: "a",
  bind_port_1_x: "y",
  bind_port_1_y: "x",
  bind_port_1_l: "leftshoulder",
  bind_port_1_r: "rightshoulder",
  bind_port_1_l2: "lefttrigger",
  bind_port_1_r2: "righttrigger",
  bind_port_1_l3: "leftstick",
  bind_port_1_r3: "rightstick",
  bind_port_1_select: "back",
  bind_port_1_start: "start",
} satisfies Partial<Record<DosboxButtonId, SdlButtonId>>;

const getAnalogType = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
): AnalogType => {
  switch (getAxis(mappingObject, sdlButtonId)) {
    case "+": {
      return "Positive";
    }
    case "-": {
      return "Negative";
    }
    default: {
      return "Positive";
    }
  }
};

type ControllerSetting = {
  [K in DosboxButtonId]: HatValue | AnalogValue | ButtonValue | null;
};

const getDosBoxButtonId = (
  mappingObject: SdlButtonMapping,
  sdlButtonId: SdlButtonId,
) => Number(getButtonIndex(mappingObject, sdlButtonId)) + 1;

const getHatDirection = (sdlButtonId: SdlButtonId): HatType => {
  switch (sdlButtonId) {
    case "dpdown": {
      return "Down";
    }
    case "dpleft": {
      return "Left";
    }
    case "dpright": {
      return "Right";
    }
    case "dpup": {
      return "Up";
    }
    default: {
      return "Down";
    }
  }
};

const getGamepadButtonMapping = (
  dosboxButtonId: keyof typeof dosboxButtonIds,
  mappingObject: SdlButtonMapping,
  portId: number,
  joystickName: string,
): ControllerSetting => {
  const sdlButtonId = dosboxButtonIds[dosboxButtonId];
  const buttonId = getDosBoxButtonId(mappingObject, sdlButtonId);

  if (isDpadHat(mappingObject, sdlButtonId)) {
    const direction = getHatDirection(sdlButtonId);
    const hatValue: HatValue = `${joystickName}|Hat|1|${direction}`;
    return {
      [dosboxButtonId]: hatValue,
    };
  }

  if (isAnalog(mappingObject, sdlButtonId)) {
    const analogType = getAnalogType(mappingObject, sdlButtonId);
    const analogValue: AnalogValue = `${joystickName}|Axis|${buttonId}|${analogType}`;
    return {
      [dosboxButtonId]: analogValue,
    };
  }

  const buttonValue: ButtonValue = `${joystickName}|Button|${buttonId}`;

  return { [dosboxButtonId]: buttonValue };
};

const getDosboxButtonIdWithPort = (dosboxButtonId: string, portId: number) =>
  dosboxButtonId.replace(
    "1",
    portId.toString(),
  ) as keyof typeof dosboxButtonIds;

const getGamepadButtonMappings = (
  mappingObject: SdlButtonMapping,
  portId: number,
  joystickName: string,
): ControllerSetting =>
  Object.keys(dosboxButtonIds).reduce<ControllerSetting>(
    (accumulator, dosboxButtonId) => ({
      ...accumulator,
      ...getGamepadButtonMapping(
        getDosboxButtonIdWithPort(dosboxButtonId, portId),
        mappingObject,
        portId,
        joystickName,
      ),
    }),
    {},
  );

const prepareAnalogValue =
  (mappingObject: SdlButtonMapping, joystickName: string) =>
  (sdlButtonId: SdlButtonId, analogType: AnalogType): AnalogValue | null => {
    const buttonId = getDosBoxButtonId(mappingObject, sdlButtonId);
    if (buttonId) {
      return `${joystickName}|Axis|${buttonId}|${analogType}`;
    }

    return null;
  };

export const getVirtualGamepad = (
  sdlDevice: Sdl.Joystick.Device,
  sdlIndex: number,
): ControllerSetting => {
  log("debug", "gamepad", { sdlDevice });

  const controller = getControllerFromJoystick(sdlDevice)!;
  const mappingObject = createSdlMappingObject(controller.mapping!);
  const portId = sdlIndex + 1;
  const deviceName = getDeviceNameFromHid(sdlDevice)!;
  const getAnalogValue = prepareAnalogValue(mappingObject, deviceName);

  return {
    ...getGamepadButtonMappings(mappingObject, portId, deviceName),
    [`bind_port_${portId}_lstickup`]: getAnalogValue("lefty", "Negative"),
    [`bind_port_${portId}_lstickdown`]: getAnalogValue("lefty", "Positive"),
    [`bind_port_${portId}_lstickleft`]: getAnalogValue("leftx", "Negative"),
    [`bind_port_${portId}_lstickright`]: getAnalogValue("leftx", "Positive"),
    [`bind_port_${portId}_rstickup`]: getAnalogValue("righty", "Negative"),
    [`bind_port_${portId}_rstickdown`]: getAnalogValue("righty", "Positive"),
    [`bind_port_${portId}_rstickleft`]: getAnalogValue("rightx", "Negative"),
    [`bind_port_${portId}_rstickright`]: getAnalogValue("rightx", "Positive"),
  };
};

const getVirtualGamepadReset = (gamepadIndex: number): ControllerSetting => {
  const portId = gamepadIndex + 1;
  return {
    ...Object.keys(dosboxButtonIds).reduce<ControllerSetting>(
      (accumulator, dosboxButtonId) => ({
        ...accumulator,
        [getDosboxButtonIdWithPort(dosboxButtonId, portId)]: "",
      }),
      {},
    ),
    [`bind_port_${portId}_lstickup`]: "",
    [`bind_port_${portId}_lstickdown`]: "",
    [`bind_port_${portId}_lstickleft`]: "",
    [`bind_port_${portId}_lstickright`]: "",
    [`bind_port_${portId}_rstickup`]: "",
    [`bind_port_${portId}_rstickdown`]: "",
    [`bind_port_${portId}_rstickleft`]: "",
    [`bind_port_${portId}_rstickright`]: "",
  };
};

export const getVirtualGamepads = (): ControllerSetting => {
  const gamepads = sdl.joystick.devices
    .filter(({ type }) => type)
    .toSorted(sortSteamDeckLast);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.reduce<ControllerSetting>(
          (accumulator, gamepad, index) => ({
            ...accumulator,
            ...getVirtualGamepad(gamepad, index),
          }),
          {},
        )
      : {};

  const gamepadResets = resetUnusedVirtualGamepads(
    2,
    gamepads.length,
    getVirtualGamepadReset,
  ).reduce((accumulator, pad) => ({ ...accumulator, ...pad }), {});

  return {
    ...virtualGamepads,
    ...gamepadResets,
  };
};
