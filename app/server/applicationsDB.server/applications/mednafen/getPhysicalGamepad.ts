import type { Sdl } from "@kmamal/sdl";
import type { GamepadID } from "./initGamepadIDs.js";
import { isWindows } from "../../../operationsystem.server.js";
import { PhysicalGamepadXinput } from "./PhysicalGamepadXinput.js";
import { PhysicalGamepadSdl } from "./PhysicalGamepadSdl.js";
import { PhysicalGamepadPs4 } from "./PhysicalGamepadPs4.js";
import { isPs4Controller } from "../../../../types/gamepad.js";

export const getPhysicalGamepad = (
  sdlGamepad: Sdl.Controller.Device,
  gamepadID: GamepadID,
) => {
  // TODO: Check if this works on windows as well
  if (isPs4Controller(sdlGamepad)) {
    return new PhysicalGamepadPs4(gamepadID.id, sdlGamepad.mapping!);
  }

  if (isWindows()) {
    return new PhysicalGamepadXinput(gamepadID.id, sdlGamepad.mapping!);
  }

  return new PhysicalGamepadSdl(gamepadID.id, sdlGamepad.mapping!);
};
