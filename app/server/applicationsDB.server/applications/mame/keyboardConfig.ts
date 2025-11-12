import {
  keyboardMapping,
  type EmuzeButtonId,
} from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import type { PortConfig } from "./config.js";
import { mameButtonIds } from "./types.js";

// TODO: set coin and start for each player. can be set game specific. How to do it generally?
// TODO: set fire and grenade. set button 1 and button 2 to mouse and gun as well. see default_lightgun.cfg
// TODO: enter is not set correctly. sdl uses the term `RETURN`, but MAME uses `ENTER`

const getVirtualGamepadReset = (gamepadIndex: number) =>
  Object.entries(mameButtonIds).map<PortConfig>(([, mameButtonId]) => [
    `P${gamepadIndex + 1}_${mameButtonId}`,
    "NONE",
  ]);

export const keyboardConfig: PortConfig[] = [
  ...Object.entries(mameButtonIds).map<PortConfig>(
    ([emuzeButtonId, mameButtonId]) => [
      `P1_${mameButtonId}`,
      `KEYCODE_${keyboardMapping[emuzeButtonId as EmuzeButtonId]}`,
    ],
  ),
  ...resetUnusedVirtualGamepads(4, 1, getVirtualGamepadReset).flat(),
];
