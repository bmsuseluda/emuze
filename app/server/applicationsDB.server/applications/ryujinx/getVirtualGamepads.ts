import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import {
  getNameIndex,
  getPlayerIndexArray,
  isGamecubeController,
} from "../../../../types/gamepad.js";
import { log } from "../../../debug.server.js";
import { keyboardConfig } from "./keyboardConfig.js";
import type { InputConfig } from "./config.js";
import { defaultInputConfig } from "./config.js";

const splitStringByIndices = (str: string, indices: number[]): string[] => {
  const result: string[] = [];
  let start = 0;

  indices.forEach((index) => {
    result.push(str.slice(start, index));
    start = index;
  });

  result.push(str.slice(start));
  return result;
};

export const getControllerIdWithIndex = (
  controllerIds: { name: string }[],
  controllerIdWithoutIndex: string,
) => {
  const controllerIdIndex = getNameIndex(
    controllerIdWithoutIndex,
    controllerIds.length,
    controllerIds,
  );
  const controllerId = `${controllerIdIndex}-${controllerIdWithoutIndex}`;

  controllerIds.push({ name: controllerIdWithoutIndex });

  return controllerId;
};

export const createControllerId = (
  controllerIds: { name: string }[],
  sdlGuid: string,
) => {
  const mapping = splitStringByIndices(sdlGuid, [2, 4, 6, 8, 10, 12, 16, 20]);
  const controllerIdWithoutIndex = `${mapping[0].padStart(8, "0")}-${mapping[5]}${mapping[4]}-${mapping[6]}-${mapping[7]}-${mapping[8]}`;
  return getControllerIdWithIndex(controllerIds, controllerIdWithoutIndex);
};

/**
 * TODO: Check joycons
 */
const createControllerType = () => {
  return "ProController";
};

const createDeviceSpecificInputConfig = (controllerName: string) => {
  if (isGamecubeController(controllerName)) {
    return {
      ...defaultInputConfig,
      right_joycon: {
        ...defaultInputConfig.right_joycon,
        button_x: "X",
        button_b: "B",
        button_y: "Y",
        button_a: "A",
      },
    };
  }

  return defaultInputConfig;
};

const getVirtualGamepad =
  (controllerIds: { name: string }[], playerIndexArray: number[]) =>
  (controller: Sdl.Joystick.Device, index: number): InputConfig => {
    log("debug", "gamepad", {
      index,
      controller,
    });

    const gamepadId = createControllerId(controllerIds, controller.guid!);

    return {
      ...createDeviceSpecificInputConfig(controller.name!),
      id: gamepadId,
      controller_type: createControllerType(),
      player_index: `Player${playerIndexArray[index] + 1}`,
    };
  };

export const getVirtualGamepads = () => {
  const controllerIds: { name: string }[] = [];
  const gamepads = sdl.joystick.devices;
  const playerIndexArray = getPlayerIndexArray(gamepads);
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(controllerIds, playerIndexArray))
      : [keyboardConfig];

  return virtualGamepads;
};
