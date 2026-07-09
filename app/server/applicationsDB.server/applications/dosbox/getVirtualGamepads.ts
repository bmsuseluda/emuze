import { log } from "../../../debug.server.js";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  getAxis,
  getButtonIndex,
  isAnalog,
  isDpadHat,
} from "../../../../types/gamepad.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { DosboxButtonId, DosboxButtonIdWithPort } from "./types.js";
import {
  AnalogType,
  AnalogValue,
  ButtonValue,
  HatType,
  HatValue,
} from "./config.js";

const dosboxButtonIds = {
  up: "dpup",
  down: "dpdown",
  left: "dpleft",
  right: "dpright",
  a: "b",
  b: "a",
  x: "y",
  y: "x",
  l: "leftshoulder",
  r: "rightshoulder",
  l2: "lefttrigger",
  r2: "righttrigger",
  l3: "leftstick",
  r3: "rightstick",
  select: "back",
  start: "start",
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

type ControllerSetting = Record<
  DosboxButtonIdWithPort,
  HatValue | AnalogValue | ButtonValue | null
>;

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

const prepareButtonIdString =
  (portId: number) =>
  (dosboxButtonId: DosboxButtonId): DosboxButtonIdWithPort =>
    `bind_port_${portId}_${dosboxButtonId}`;

const getGamepadButtonMapping = (
  dosboxButtonId: keyof typeof dosboxButtonIds,
  mappingObject: SdlButtonMapping,
  portId: number,
  joystickName: string,
): ControllerSetting => {
  const sdlButtonId = dosboxButtonIds[dosboxButtonId];
  const dosboxButtonIdString = prepareButtonIdString(portId)(dosboxButtonId);
  const buttonId = getDosBoxButtonId(mappingObject, sdlButtonId);

  if (isDpadHat(mappingObject, sdlButtonId)) {
    const direction = getHatDirection(sdlButtonId);
    const hatValue: HatValue = `${joystickName}|Hat|1|${direction}`;
    return {
      [dosboxButtonIdString]: hatValue,
    };
  }

  if (isAnalog(mappingObject, sdlButtonId)) {
    const analogType = getAnalogType(mappingObject, sdlButtonId);
    const analogValue: AnalogValue = `${joystickName}|Axis|${buttonId}|${analogType}`;
    return {
      [dosboxButtonIdString]: analogValue,
    };
  }

  const buttonValue: ButtonValue = `${joystickName}|Button|${buttonId}`;

  return { [dosboxButtonIdString]: buttonValue };
};

const getGamepadButtonMappings = (
  mappingObject: SdlButtonMapping,
  portId: number,
  joystickName: string,
): ControllerSetting =>
  Object.keys(dosboxButtonIds).reduce<ControllerSetting>(
    (accumulator, dosboxButtonId) => ({
      ...accumulator,
      ...getGamepadButtonMapping(
        dosboxButtonId as keyof typeof dosboxButtonIds,
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
  emuzeController: EmuzeController,
  sdlIndex: number,
): ControllerSetting => {
  log("debug", "gamepad", emuzeController);

  const { mappingObject, hidName, joystickName } = emuzeController;
  const portId = sdlIndex + 1;
  const deviceName = hidName || joystickName;
  const getAnalogValue = prepareAnalogValue(mappingObject, deviceName);
  const getButtonIdString = prepareButtonIdString(portId);

  return {
    ...getGamepadButtonMappings(mappingObject, portId, deviceName),
    [getButtonIdString("lstickup")]: getAnalogValue("lefty", "Negative"),
    [getButtonIdString("lstickdown")]: getAnalogValue("lefty", "Positive"),
    [getButtonIdString("lstickleft")]: getAnalogValue("leftx", "Negative"),
    [getButtonIdString("lstickright")]: getAnalogValue("leftx", "Positive"),
    [getButtonIdString("rstickup")]: getAnalogValue("righty", "Negative"),
    [getButtonIdString("rstickdown")]: getAnalogValue("righty", "Positive"),
    [getButtonIdString("rstickleft")]: getAnalogValue("rightx", "Negative"),
    [getButtonIdString("rstickright")]: getAnalogValue("rightx", "Positive"),
  };
};

const getVirtualGamepadReset = (gamepadIndex: number): ControllerSetting => {
  const portId = gamepadIndex + 1;
  const getButtonIdString = prepareButtonIdString(portId);

  return {
    ...Object.keys(dosboxButtonIds).reduce<ControllerSetting>(
      (accumulator, dosboxButtonId) => ({
        ...accumulator,
        [getButtonIdString(dosboxButtonId as keyof typeof dosboxButtonIds)]: "",
      }),
      {},
    ),
    [getButtonIdString("lstickup")]: "",
    [getButtonIdString("lstickdown")]: "",
    [getButtonIdString("lstickleft")]: "",
    [getButtonIdString("lstickright")]: "",
    [getButtonIdString("rstickup")]: "",
    [getButtonIdString("rstickdown")]: "",
    [getButtonIdString("rstickleft")]: "",
    [getButtonIdString("rstickright")]: "",
  };
};

export const getVirtualGamepads = (): ControllerSetting => {
  const gamepads = getControllers();

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
