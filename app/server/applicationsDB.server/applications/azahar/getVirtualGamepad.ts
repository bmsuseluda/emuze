import type { Sdl } from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import { getSetting } from "./getSettings.js";
import type { ParamToReplace } from "../../configFile.js";
import type { AzaharButtonId } from "./types.js";
import { getKeyboardDebugMapping } from "./keyboardConfig.js";
import sdl from "@kmamal/sdl";
import { isSteamDeckController } from "../../../../types/gamepad.js";

export const getGamepad = () => {
  const gamepads = sdl.joystick.devices;

  if (gamepads.length === 1) {
    return gamepads[0];
  }

  if (gamepads.length > 1) {
    if (isSteamDeckController(gamepads[0])) {
      return gamepads[1];
    } else {
      return gamepads[0];
    }
  }
  return null;
};

const azaharButtonIds = {
  button_a: 1,
  button_b: 0,
  button_x: 3,
  button_y: 2,
  button_l: 4,
  button_r: 5,
  button_select: 6,
  button_start: 7,
} satisfies Partial<Record<AzaharButtonId, number>>;

const getGamepadButtonMapping = (
  azaharButtonId: AzaharButtonId,
  button: number,
  guid: string,
): ParamToReplace[] =>
  getSetting(
    `profiles\\1\\${azaharButtonId}`,
    `button:${button},engine:sdl,guid:${guid},port:0`,
  );

const getGamepadDpadButtonMapping = (
  direction: "up" | "down" | "left" | "right",
  guid: string,
): ParamToReplace[] =>
  getSetting(
    `profiles\\1\\button_${direction}`,
    `direction:${direction},engine:sdl,guid:${guid},hat:0,port:0`,
  );

const getGamepadButtonMappings = (guid: string): ParamToReplace[] =>
  Object.entries(azaharButtonIds).flatMap(([azaharButtonId, button]) =>
    getGamepadButtonMapping(azaharButtonId as AzaharButtonId, button, guid),
  );

export const getVirtualGamepad = (
  sdlDevice: Sdl.Joystick.Device,
): ParamToReplace[] => {
  log("debug", "gamepad", { sdlDevice });

  const guid = sdlDevice.guid!;

  return [
    ...getSetting("profile", 0),
    ...getGamepadButtonMappings(guid),
    ...getGamepadDpadButtonMapping("up", guid),
    ...getGamepadDpadButtonMapping("down", guid),
    ...getGamepadDpadButtonMapping("left", guid),
    ...getGamepadDpadButtonMapping("right", guid),
    ...getSetting(
      "profiles\\1\\button_zl",
      `axis:2,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\button_zr",
      `axis:5,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\circle_pad",
      `axis_x:0,axis_y:1,deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getSetting(
      "profiles\\1\\c_stick",
      `axis_x:3,axis_y:4,deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
    ),
    ...getKeyboardDebugMapping(),
  ];
};
