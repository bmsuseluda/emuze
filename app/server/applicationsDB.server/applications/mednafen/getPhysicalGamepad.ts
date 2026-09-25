import { PhysicalGamepadSdl } from "./PhysicalGamepadSdl.js";
import sdl from "@kmamal/sdl";
import {
  DetectSdlGuidIndex,
  EmuzeController,
} from "../../../gamepad.server.js";

export const getPhysicalGamepad = (
  { guid, mapping, sdlJoystick }: EmuzeController,
  detectSdlGuidIndex: DetectSdlGuidIndex,
  index: number,
) => {
  const { buttons } = sdl.joystick.openDevice(sdlJoystick);
  const guidIndex = detectSdlGuidIndex(guid, index);

  return new PhysicalGamepadSdl(guid, guidIndex, mapping, buttons.length);
};
