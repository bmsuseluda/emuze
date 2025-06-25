import type { Sdl } from "@bmsuseluda/sdl";
import type { GamepadID } from "./initGamepadIDs.js";
import { isDinputController } from "../../gamepads.js";
import { PhysicalGamepadDinput } from "./PhysicalGamepadDinput.js";
import { isWindows } from "../../../operationsystem.server.js";
import { PhysicalGamepadXinput } from "./PhysicalGamepadXinput.js";
import { PhysicalGamepadSdl } from "./PhysicalGamepadSdl.js";

export const getPhysicalGamepad = (
  sdlGamepad: Sdl.Controller.Device,
  gamepadID: GamepadID,
) => {
  if (isDinputController(sdlGamepad.type)) {
    return new PhysicalGamepadDinput(gamepadID.id, sdlGamepad.mapping);
  }

  if (isWindows()) {
    return new PhysicalGamepadXinput(gamepadID.id, sdlGamepad.mapping);
  }

  return new PhysicalGamepadSdl(gamepadID.id, sdlGamepad.mapping);
};
