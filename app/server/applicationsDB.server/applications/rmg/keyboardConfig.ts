import { EOL } from "node:os";
import sdl from "@kmamal/sdl";
import type { ButtonDetailsFunction, RmgButtonId } from "./types.js";
import { mapAndJoinEmuzeButtonIds, rmgButtonIds } from "./types.js";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import { capitalizeFirst } from "../../../capitalizeFirst.server.js";

const getInputType: ButtonDetailsFunction = () => "-1";

const getName: ButtonDetailsFunction = (buttonId: EmuzeButtonId) =>
  capitalizeFirst(keyboardMapping[buttonId]);

const getData: ButtonDetailsFunction = (buttonId: EmuzeButtonId) =>
  sdl.keyboard.SCANCODE[keyboardMapping[buttonId]];

const getExtraData: ButtonDetailsFunction = () => "0";

const getRmgButtonMapping = (
  rmgButtonId: RmgButtonId,
  emuzeButtonIds: EmuzeButtonId[],
) => {
  return [
    `${rmgButtonId}_InputType = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getInputType)}"`,
    `${rmgButtonId}_Name = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getName)}"`,
    `${rmgButtonId}_Data = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getData)}"`,
    `${rmgButtonId}_ExtraData = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getExtraData)}"`,
  ];
};

const getKeyboardButtonMappings = (): string[] =>
  Object.entries(rmgButtonIds).flatMap(([rmgButtonId, emuzeButtonIds]) =>
    getRmgButtonMapping(rmgButtonId as RmgButtonId, emuzeButtonIds),
  );

// TODO: Check how keyboard mapping works in rmg
export const keyboardConfig = `[Rosalie's Mupen GUI - Input Plugin Profile 0]
PluggedIn = True
DeviceName = "Keyboard"
DeviceType = 3
DevicePath = ""
DeviceSerial = ""
Deadzone = 9
Sensitivity = 100
Pak = 0
RemoveDuplicateMappings = True
FilterEventsForButtons = True
FilterEventsForAxis = True
${getKeyboardButtonMappings().join(EOL)}`;
