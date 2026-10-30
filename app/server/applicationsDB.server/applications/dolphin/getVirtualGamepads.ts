import { EOL } from "node:os";
import { isGamecubeController } from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { log } from "../../../debug.server.js";
import type { DolphinButtonId } from "./types.js";
import {
  EmuzeController,
  getControllersSdl3,
  getSdlNameIndex,
} from "../../../gamepad.server.js";

const getDolphinButtonIds = (isGamecubeController: boolean) =>
  ({
    "Buttons/A": `${isGamecubeController ? "`Button S`" : "`Button E`"}`,
    "Buttons/B": `${isGamecubeController ? "`Button W`" : "`Button S`"}`,
    "Buttons/X": `${isGamecubeController ? "`Button E`" : "`Button N`"}`,
    "Buttons/Y": `${isGamecubeController ? "`Button N`" : "`Button W` | `Shoulder L`"}`,
    "Buttons/Z": `\`Shoulder R\``,
    "Buttons/Start": `Start`,
    "Main Stick/Up": `\`Left Y+\``,
    "Main Stick/Down": `\`Left Y-\``,
    "Main Stick/Left": `\`Left X-\``,
    "Main Stick/Right": `\`Left X+\``,
    "C-Stick/Up": `\`Right Y+\``,
    "C-Stick/Down": `\`Right Y-\``,
    "C-Stick/Left": `\`Right X-\``,
    "C-Stick/Right": `\`Right X+\``,
    "Triggers/L": `\`Trigger L\``,
    "Triggers/R": `\`Trigger R\``,
    "D-Pad/Up": `\`Pad N\``,
    "D-Pad/Down": `\`Pad S\``,
    "D-Pad/Left": `\`Pad W\``,
    "D-Pad/Right": `\`Pad E\``,
    "Triggers/L-Analog": `\`Trigger L\``,
    "Triggers/R-Analog": `\`Trigger R\``,
  }) satisfies Partial<Record<DolphinButtonId, string>>;

export const getVirtualGamepad =
  (devices: EmuzeController[]) =>
  (controller: EmuzeController, index: number) => {
    log("debug", "gamepad", { index, controller });

    const { nameOsSpecific } = controller;
    const nameIndex = getSdlNameIndex(nameOsSpecific, index, devices);

    const gamecubeController = isGamecubeController(nameOsSpecific);
    const dolphinButtonIds = Object.entries(
      getDolphinButtonIds(gamecubeController),
    ).map(([key, value]) => `${key} = ${value}`);

    return [
      `[GCPad${index + 1}]`,
      `Device = SDL/${nameIndex}/${nameOsSpecific}`,
      ...dolphinButtonIds,
      `Main Stick/Modifier = \`Thumb L\``,
      `Main Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
      `C-Stick/Modifier = \`Thumb R\``,
      `C-Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
      `Rumble/Motor = \`Motor L\` | \`Motor R\``,
    ].join(EOL);
  };

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [
    `[GCPad${gamepadIndex + 1}]`,
    "Device = XInput2/0/Virtual core pointer",
  ].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = getControllersSdl3();

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(gamepads))
      : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      4,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ),
  ];
};
