import type { Sdl } from "@kmamal/sdl";
import type { ParamToReplace } from "../../configFile.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import { getSetting } from "./getSettings.js";
import type { EdenButtonId } from "./types.js";

export const scancodes = {
  F1: 1,
  F2: 2,
  F3: 3,
  T: 84,
  G: 71,
  F: 70,
  H: 72,
  BACKSPACE: 16777219,
  RETURN: 16777220,
  J: 75,
  K: 74,
  U: 73,
  I: 85,
  L: 76,
  O: 79,
  "8": 56,
  "9": 57,
  X: 58,
  Y: 89,
  P: 80,
  E: 69,
  V: 86,
  RSHIFT: 96,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  UP: 16777235,
  DOWN: 16777237,
  LEFT: 16777234,
  RIGHT: 16777236,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

const edenButtonIds = {
  dpadUp: "button_dup",
  dpadLeft: "button_dleft",
  dpadDown: "button_ddown",
  dpadRight: "button_dright",
  a: "button_a",
  b: "button_b",
  x: "button_x",
  y: "button_y",
  back: "button_minus",
  start: "button_plus",
  leftShoulder: "button_l",
  rightShoulder: "button_r",
  leftStick: "button_lstick",
  rightStick: "button_rstick",
} satisfies Partial<Record<EmuzeButtonId, EdenButtonId>>;

const getKeyboardButtonMapping = (
  edenButtonId: EdenButtonId,
  code: number,
): ParamToReplace[] =>
  getSetting(`player_0_${edenButtonId}`, `code:${code},engine:keyboard`);

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(edenButtonIds).flatMap(([sdlButtonId, edenButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];

    return getKeyboardButtonMapping(edenButtonId, scancodes[sdlScancodeName]);
  });

export const getKeyboardDebugMapping = (): ParamToReplace[] => [
  ...getKeyboardButtonMapping("button_home", scancodes.E),
];

export const keyboardConfig: ParamToReplace[] = [
  ...getKeyboardButtonMappings(),
  ...getKeyboardDebugMapping(),

  ...getSetting(
    "player_0_button_zl",
    `code:${scancodes[keyboardMapping["leftTrigger"]]},direction:+,engine:keyboard,threshold:0.5`,
  ),
  ...getSetting(
    "player_0_button_zr",
    `code:${scancodes[keyboardMapping["rightTrigger"]]},direction:+,engine:keyboard,threshold:0.5`,
  ),
];
