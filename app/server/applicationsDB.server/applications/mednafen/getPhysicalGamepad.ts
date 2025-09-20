import type { Sdl } from "@kmamal/sdl";
import type { MednafenGamepadID } from "./initGamepadIDs.js";
import { isWindows } from "../../../operationsystem.server.js";
import { PhysicalGamepadXinput } from "./PhysicalGamepadXinput.js";
import { PhysicalGamepadSdl } from "./PhysicalGamepadSdl.js";
import { isXinputController } from "../../../../types/gamepad.js";

export const getPhysicalGamepad = (
  sdlGamepad: Sdl.Controller.Device,
  gamepadID: MednafenGamepadID,
) => {
  // TODO: Check if this works on windows as well
  // if (isPs4Controller(sdlGamepad)) {
  //   return new PhysicalGamepadPs4(gamepadID.id, sdlGamepad.mapping!);
  // }

  if (isWindows() && isXinputController(sdlGamepad.type)) {
    return new PhysicalGamepadXinput(gamepadID.id, sdlGamepad.mapping!);
  }

  return new PhysicalGamepadSdl(gamepadID.id, sdlGamepad.mapping!);
};
