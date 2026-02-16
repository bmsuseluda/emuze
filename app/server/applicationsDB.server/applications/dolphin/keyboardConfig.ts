import { EOL } from "node:os";
import {
  keyboardMappingNintendo,
  type EmuzeButtonId,
} from "../../../../types/gamepad.js";
import type { DolphinButtonId } from "./types.js";
import { capitalizeFirst } from "../../../capitalizeFirst.server.js";
import { normalizeNewLines } from "../../configFile.js";

export const dolphinButtonIds = {
  dpadUp: "D-Pad/Up",
  dpadDown: "D-Pad/Down",
  dpadLeft: "D-Pad/Left",
  dpadRight: "D-Pad/Right",
  start: "Buttons/Start",
  a: "Buttons/A",
  b: "Buttons/B",
  x: "Buttons/X",
  y: "Buttons/Y",
  leftShoulder: "Buttons/Z",
  leftTrigger: "Triggers/L",
  rightTrigger: "Triggers/R",
  leftStickUp: "Main Stick/Up",
  leftStickDown: "Main Stick/Down",
  leftStickLeft: "Main Stick/Left",
  leftStickRight: "Main Stick/Right",
  rightStickUp: "C-Stick/Up",
  rightStickDown: "C-Stick/Down",
  rightStickLeft: "C-Stick/Left",
  rightStickRight: "C-Stick/Right",
} satisfies Partial<Record<EmuzeButtonId, DolphinButtonId>>;

const getKeyboardButtonMappings = (): string[] =>
  Object.entries(dolphinButtonIds).map(
    ([sdlButtonId, dolphinButtonId]) =>
      `${dolphinButtonId} = ${capitalizeFirst(keyboardMappingNintendo[sdlButtonId as EmuzeButtonId])}`,
  );

export const keyboardConfig = normalizeNewLines(`[GCPad1]
Device = XInput2/0/Virtual core pointer
${getKeyboardButtonMappings().join(EOL)}
Main Stick/Modifier = \`Shift\`
Main Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42
C-Stick/Modifier = \`Ctrl\`
C-Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`);
