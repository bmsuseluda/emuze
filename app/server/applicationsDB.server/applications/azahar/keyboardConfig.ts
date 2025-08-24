import type { Sdl } from "@kmamal/sdl";
import type { ParamToReplace } from "../../configFile.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import { getSetting } from "./getSettings.js";
import type { AzaharButtonId } from "./types.js";

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

const azaharButtonIds = {
  dpadUp: "button_up",
  dpadLeft: "button_left",
  dpadDown: "button_down",
  dpadRight: "button_right",
  a: "button_a",
  b: "button_b",
  x: "button_x",
  y: "button_y",
  back: "button_select",
  start: "button_start",
  leftShoulder: "button_l",
  rightShoulder: "button_r",
} satisfies Partial<Record<EmuzeButtonId, AzaharButtonId>>;

const getKeyboardButtonMapping = (
  azaharButtonId: AzaharButtonId,
  code: number,
): ParamToReplace[] =>
  getSetting(`profiles\\1\\${azaharButtonId}`, `code:${code},engine:keyboard`);

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(azaharButtonIds).flatMap(([sdlButtonId, azaharButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];

    return getKeyboardButtonMapping(azaharButtonId, scancodes[sdlScancodeName]);
  });

export const getKeyboardDebugMapping = (): ParamToReplace[] => [
  ...getKeyboardButtonMapping("button_debug", scancodes.Y),
  ...getKeyboardButtonMapping("button_gpio14", scancodes.P),
  ...getKeyboardButtonMapping("button_home", scancodes.E),
  ...getKeyboardButtonMapping("button_power", scancodes.V),
];

export const keyboardConfig: ParamToReplace[] = [
  ...getSetting("profile", 0),
  { keyValue: "profiles\\1\\name\\default=false" },
  { keyValue: "profiles\\1\\touch_from_button_map\\default=false" },
  { keyValue: "profiles\\1\\udp_pad_index\\default=false" },
  { keyValue: "profiles\\1\\use_touch_from_button\\default=false" },
  { keyValue: "touch_from_button_maps\\1\\name\\default=false" },
  { keyValue: "use_artic_base_controller\\default=false" },

  ...getKeyboardButtonMappings(),
  ...getKeyboardDebugMapping(),

  ...getSetting(
    "profiles\\1\\button_zl",
    `code:${scancodes[keyboardMapping["leftTrigger"]]},direction:+,engine:keyboard,threshold:0.5`,
  ),
  ...getSetting(
    "profiles\\1\\button_zr",
    `code:${scancodes[keyboardMapping["rightTrigger"]]},direction:+,engine:keyboard,threshold:0.5`,
  ),
  ...getSetting(
    "profiles\\1\\circle_pad",
    `down:code$0${scancodes[keyboardMapping["leftStickDown"]]}$1engine$0keyboard,engine:analog_from_button,left:code$0${scancodes[keyboardMapping["leftStickLeft"]]}$1engine$0keyboard,modifier:code$081$1engine$0keyboard,modifier_scale:0.500000,right:code$0${scancodes[keyboardMapping["leftStickRight"]]}$1engine$0keyboard,up:code$0${scancodes[keyboardMapping["leftStickUp"]]}$1engine$0keyboard`,
  ),
  ...getSetting(
    "profiles\\1\\c_stick",
    `down:code$0${scancodes[keyboardMapping["rightStickDown"]]}$1engine$0keyboard,engine:analog_from_button,left:code$0${scancodes[keyboardMapping["rightStickLeft"]]}$1engine$0keyboard,modifier:code$081$1engine$0keyboard,modifier_scale:0.500000,right:code$0${scancodes[keyboardMapping["rightStickRight"]]}$1engine$0keyboard,up:code$0${scancodes[keyboardMapping["rightStickUp"]]}$1engine$0keyboard`,
  ),
  ...getSetting(
    "profiles\\1\\motion_device",
    "engine:motion_emu,update_period:100,sensitivity:0.01,tilt_clamp:90.0",
  ),
  ...getSetting("profiles\\1\\touch_device", "engine:emu_window"),
  ...getSetting("profiles\\1\\udp_input_address", "127.0.0.1", false),
  ...getSetting("profiles\\1\\udp_input_port", 26760),
];
