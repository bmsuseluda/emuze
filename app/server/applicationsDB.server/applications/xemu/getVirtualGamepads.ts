import type { ParamToReplace } from "../../configFile.js";
import { removeVendorFromGuid } from "../../../../types/gamepad.js";
import { log } from "../../../debug.server.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";

const getVirtualGamepad = (
  emuzeController: EmuzeController,
  sdlIndex: number,
): ParamToReplace[] => {
  log("debug", "gamepad", { sdlIndex, emuzeController });

  return [
    {
      keyValue: `port${sdlIndex + 1}_driver = 'usb-xbox-gamepad'`,
    },
    {
      keyValue: `port${sdlIndex + 1} = '${removeVendorFromGuid(emuzeController.guid)}'`,
    },
  ];
};

export const getVirtualGamepads = () => {
  const gamepads = getControllers();

  const virtualGamepads =
    gamepads.length > 0 ? gamepads.flatMap(getVirtualGamepad) : keyboardConfig;

  return virtualGamepads;
};
