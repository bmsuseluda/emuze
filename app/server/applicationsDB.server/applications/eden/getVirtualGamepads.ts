import type { Sdl } from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import { getSetting } from "./getSettings.js";
import type { ParamToReplace } from "../../configFile.js";
import type { EdenButtonId } from "./types.js";
import sdl from "@kmamal/sdl";
import type {
  SdlButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getButtonIndex,
  getPlayerIndexArray,
  isAnalog,
  isDpadHat,
  isSteamDeckController,
} from "../../../../types/gamepad.js";
import { getControllerFromJoystick } from "../../../gamepad.server.js";
import { getKeyboardDebugMapping, keyboardConfig } from "./keyboardConfig.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";

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

const edenButtonIds = {
  button_dup: "dpup",
  button_ddown: "dpdown",
  button_dleft: "dpleft",
  button_dright: "dpright",
  button_a: "b",
  button_b: "a",
  button_x: "y",
  button_y: "x",
  button_l: "leftshoulder",
  button_r: "rightshoulder",
  button_zl: "lefttrigger",
  button_zr: "righttrigger",
  button_minus: "back",
  button_plus: "start",
} satisfies Partial<Record<EdenButtonId, SdlButtonId>>;

const getGamepadButtonMapping = (
  edenButtonId: keyof typeof edenButtonIds,
  guid: string,
  mappingObject: SdlButtonMapping,
  playerIndex: number,
): ParamToReplace[] => {
  const sdlButtonId = edenButtonIds[edenButtonId];

  if (isDpadHat(mappingObject, sdlButtonId)) {
    const direction = edenButtonId.split("_d")[1];
    return getSetting(
      `player_${playerIndex}_${edenButtonId}`,
      `direction:${direction},engine:sdl,guid:${guid},hat:0,port:0`,
    );
  }

  if (isAnalog(mappingObject, sdlButtonId)) {
    return getSetting(
      `player_${playerIndex}_${edenButtonId}`,
      `axis:${getButtonIndex(mappingObject, sdlButtonId)},engine:sdl,guid:${guid},port:0,threshold:0.5`,
    );
  }

  return getSetting(
    `player_${playerIndex}_${edenButtonId}`,
    `button:${getButtonIndex(mappingObject, sdlButtonId)},engine:sdl,guid:${guid},port:0`,
  );
};

const getGamepadButtonMappings = (
  guid: string,
  mappingObject: SdlButtonMapping,
  playerIndex: number,
): ParamToReplace[] =>
  Object.keys(edenButtonIds).flatMap((edenButtonId) =>
    getGamepadButtonMapping(
      edenButtonId as keyof typeof edenButtonIds,
      guid,
      mappingObject,
      playerIndex,
    ),
  );

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number): ParamToReplace[] => {
    log("debug", "gamepad", { sdlDevice });

    const guid = sdlDevice.guid!;
    const controller = getControllerFromJoystick(sdlDevice)!;
    const mappingObject = createSdlMappingObject(controller.mapping!);
    const playerIndex = playerIndexArray[sdlIndex];

    return [
      ...getSetting(`player_${playerIndex}_connected`, true),
      ...getGamepadButtonMappings(guid, mappingObject, playerIndex),
      ...getSetting(
        `player_${playerIndex}_lstick`,
        `axis_x:${getButtonIndex(mappingObject, "leftx")},axis_y:${getButtonIndex(mappingObject, "lefty")},deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
      ),
      ...getSetting(
        `player_${playerIndex}_rstick`,
        `axis_x:${getButtonIndex(mappingObject, "rightx")},axis_y:${getButtonIndex(mappingObject, "righty")},deadzone:0.100000,engine:sdl,guid:${guid},port:0`,
      ),
      ...getKeyboardDebugMapping(),
    ];
  };

const getVirtualGamepadReset = (gamepadIndex: number): ParamToReplace => ({
  keyValue: `player_${gamepadIndex}_connected\\default=true`,
});

export const getVirtualGamepads = () => {
  const gamepads = sdl.joystick.devices.filter(({ type }) => type);
  const playerIndexArray = getPlayerIndexArray(gamepads);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.flatMap(getVirtualGamepad(playerIndexArray))
      : keyboardConfig;

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      10,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ),
  ];
};
