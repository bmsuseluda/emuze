import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { keyboardConfig } from "./keyboardConfig.js";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import type { ControllerConfigFile } from "./config.js";
import {
  defaultGamepadConfig,
  defaultProControllerConfig,
} from "./defaultGamepadConfig.js";
import {
  getNameIndex,
  getPlayerIndexArray,
} from "../../../../types/gamepad.js";
import { getJoystickFromController } from "../../../gamepad.server.js";

const getVirtualGamepad =
  (playerIndexArray: number[], devices: Sdl.Controller.Device[]) =>
  (controller: Sdl.Controller.Device, index: number): VirtualGamepadFile => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false,
    });
    const defaultControllerConfig = parser.parse(
      index === 0 ? defaultGamepadConfig : defaultProControllerConfig,
    );
    const { guid } = getJoystickFromController(controller)!;
    const { name } = controller;

    const controllerConfig: ControllerConfigFile = {
      ...defaultControllerConfig,
      emulated_controller: {
        ...defaultControllerConfig.emulated_controller,
        controller: {
          ...defaultControllerConfig.emulated_controller.controller,
          uuid: `${getNameIndex(name, index, devices)}_${guid}`,
          display_name: name,
        },
      },
    };

    const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
    const content: string = builder.build(controllerConfig);
    return { content, playerIndex: playerIndexArray[index] };
  };

interface VirtualGamepadFile {
  content: string;
  playerIndex: number;
}

export const getVirtualGamepads = (): VirtualGamepadFile[] => {
  const gamepads = sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  if (gamepads.length > 0) {
    const mappings = gamepads.map(
      getVirtualGamepad(playerIndexArray, gamepads),
    );

    return mappings;
  }

  return [{ content: keyboardConfig, playerIndex: 0 }];
};
