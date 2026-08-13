import { keyboardConfig } from "./keyboardConfig.js";
import { XMLParser } from "fast-xml-parser";
import XMLBuilder from "fast-xml-builder";
import type { ControllerConfigFile } from "./config.js";
import {
  defaultGamepadConfig,
  defaultProControllerConfig,
} from "./defaultGamepadConfig.js";
import { getNameIndex } from "../../../../types/gamepad.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";

const getVirtualGamepad =
  (devices: EmuzeController[]) =>
  (controller: EmuzeController, index: number): string => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false,
    });
    const defaultControllerConfig = parser.parse(
      index === 0 ? defaultGamepadConfig : defaultProControllerConfig,
    );
    const { name, guid } = controller;

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
    return content;
  };

export const getVirtualGamepads = (): string[] => {
  const gamepads = getControllers();

  if (gamepads.length > 0) {
    const mappings = gamepads.map(getVirtualGamepad(gamepads));

    return mappings;
  }

  return [keyboardConfig];
};
