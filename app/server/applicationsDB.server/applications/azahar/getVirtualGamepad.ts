import { log } from "../../../debug.server.js";
import { getSetting } from "./getSettings.js";
import type { ParamToReplace } from "../../configFile.js";
import type { AzaharButtonId } from "./types.js";
import { getKeyboardDebugMapping } from "./keyboardConfig.js";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  getButtonIndex,
  isAnalog,
  isDpadHat,
} from "../../../../types/gamepad.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";

export const getGamepad = () => {
  const gamepads = getControllers();

  return gamepads.at(0);
};

const azaharButtonIds = {
  button_up: "dpup",
  button_down: "dpdown",
  button_left: "dpleft",
  button_right: "dpright",
  button_a: "b",
  button_b: "a",
  button_x: "y",
  button_y: "x",
  button_l: "leftshoulder",
  button_r: "rightshoulder",
  button_zl: "lefttrigger",
  button_zr: "righttrigger",
  button_select: "back",
  button_start: "start",
} satisfies Partial<Record<AzaharButtonId, SdlButtonId>>;

const getGamepadButtonMapping = (
  azaharButtonId: keyof typeof azaharButtonIds,
  guid: string,
  mappingObject: SdlButtonMapping,
): ParamToReplace[] => {
  const sdlButtonId = azaharButtonIds[azaharButtonId];

  if (isDpadHat(mappingObject, sdlButtonId)) {
    const direction = azaharButtonId.split("_")[1];
    return getSetting(
      `profiles\\1\\${azaharButtonId}`,
      `direction:${direction},engine:sdl,guid:${guid},hat:0,port:0`,
    );
  }

  if (isAnalog(mappingObject, sdlButtonId)) {
    return getSetting(
      `profiles\\1\\${azaharButtonId}`,
      `axis:${getButtonIndex(mappingObject, sdlButtonId)},engine:sdl,guid:${guid},port:0,threshold:0.5`,
    );
  }

  return getSetting(
    `profiles\\1\\${azaharButtonId}`,
    `button:${getButtonIndex(mappingObject, sdlButtonId)},engine:sdl,guid:${guid},port:0`,
  );
};

const getGamepadButtonMappings = (
  guid: string,
  mappingObject: SdlButtonMapping,
): ParamToReplace[] =>
  Object.keys(azaharButtonIds).flatMap((azaharButtonId) =>
    getGamepadButtonMapping(
      azaharButtonId as keyof typeof azaharButtonIds,
      guid,
      mappingObject,
    ),
  );

export const getVirtualGamepad = (
  emuzeController: EmuzeController,
): ParamToReplace[] => {
  log("debug", "gamepad", emuzeController);

  const { guid, mappingObject } = emuzeController;

  return [
    ...getSetting("profile", 0),
    ...getGamepadButtonMappings(guid, mappingObject),
    ...getSetting(
      "profiles\\1\\circle_pad",
      `axis_x:${getButtonIndex(mappingObject, "leftx")},axis_y:${getButtonIndex(mappingObject, "lefty")},deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\c_stick",
      `axis_x:${getButtonIndex(mappingObject, "rightx")},axis_y:${getButtonIndex(mappingObject, "righty")},deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getKeyboardDebugMapping(),
  ];
};
