import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import type { ParamToReplace } from "../../configFile.js";
import {
  getPlayerIndexArray,
  removeVendorFromGuid,
} from "../../../../types/gamepad.js";
import { log } from "../../../debug.server.js";
import { keyboardConfig } from "./keyboardConfig.js";

const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number): ParamToReplace[] => {
    log("debug", "gamepad", { sdlIndex, sdlDevice });

    return [
      {
        keyValue: `port${playerIndexArray[sdlIndex] + 1}_driver = 'usb-xbox-gamepad'`,
      },
      {
        keyValue: `port${playerIndexArray[sdlIndex] + 1} = '${removeVendorFromGuid(sdlDevice.guid!)}'`,
      },
    ];
  };

export const getVirtualGamepads = () => {
  const gamepads = sdl.joystick.devices;
  const playerIndexArray = getPlayerIndexArray(gamepads);
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.flatMap(getVirtualGamepad(playerIndexArray))
      : keyboardConfig;

  return virtualGamepads;
};
