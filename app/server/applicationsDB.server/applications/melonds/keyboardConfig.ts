import type { Sdl } from "@kmamal/sdl";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import { replaceSection } from "../../configFile.js";
import type { MelonDsButtonId } from "./types.js";

export const scancodes = {
  F2: 16777265,
  T: 84,
  G: 71,
  F: 70,
  H: 72,
  BACKSPACE: -2130706400,
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
  RSHIFT: -2130706400,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  UP: 16777235,
  DOWN: 16777237,
  LEFT: 16777234,
  RIGHT: 16777236,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

const melonDsButtonIds = {
  dpadUp: "Up",
  dpadLeft: "Left",
  dpadDown: "Down",
  dpadRight: "Right",
  a: "B",
  b: "A",
  x: "Y",
  y: "X",
  back: "Select",
  start: "Start",
  leftShoulder: "L",
  rightShoulder: "R",
} satisfies Partial<Record<EmuzeButtonId, MelonDsButtonId>>;

const getKeyboardButtonMappings = (): ParamToReplace[] =>
  Object.entries(melonDsButtonIds).map(([sdlButtonId, melonDsButtonId]) => {
    const sdlScancodeName: Sdl.Keyboard.ScancodeNames =
      keyboardMapping[sdlButtonId as EmuzeButtonId];
    const sdlScancode = scancodes[sdlScancodeName] as number;

    return {
      keyValue: `${melonDsButtonId} = ${sdlScancode}`,
    };
  });

export const replaceKeyboardConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Instance0.Keyboard]", [
    ...getKeyboardButtonMappings(),
    { keyValue: `HK_FullscreenToggle = ${scancodes.F2}` },
  ]);
