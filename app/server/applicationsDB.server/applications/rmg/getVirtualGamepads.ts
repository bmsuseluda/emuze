import { EOL } from "node:os";
import type {
  EmuzeButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  emuzeToSdlButtonId,
  getButtonIndex,
  getPlayerIndexArray,
  isAnalog,
  isController,
} from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { log } from "../../../debug.server.js";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { keyboardConfig } from "./keyboardConfig.js";
import type { ButtonDetailsFunction, RmgButtonId } from "./types.js";
import { mapAndJoinEmuzeButtonIds, rmgButtonIds } from "./types.js";
import { isSteamOs } from "../../../operationsystem.server.js";
import { normalizeNewLines } from "../../configFile.js";

const getInputType =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) =>
    isAnalog(mappingObject, emuzeToSdlButtonId[buttonId].sdlButtonId) ? 1 : 0;

const getName: ButtonDetailsFunction = (buttonId: EmuzeButtonId) => {
  const { sdlButtonId, qualifier } = emuzeToSdlButtonId[buttonId];
  return `${sdlButtonId}${qualifier || ""}`;
};

const getData =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) =>
    getButtonIndex(mappingObject, emuzeToSdlButtonId[buttonId].sdlButtonId);

const getExtraData: ButtonDetailsFunction = (buttonId: EmuzeButtonId) => {
  const { qualifier } = emuzeToSdlButtonId[buttonId];
  return qualifier === "+" ? 1 : 0;
};

const getRmgButtonMapping = (
  mappingObject: SdlButtonMapping,
  rmgButtonId: RmgButtonId,
  emuzeButtonIds: EmuzeButtonId[],
) => {
  return [
    `${rmgButtonId}_InputType = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getInputType(mappingObject))}"`,
    `${rmgButtonId}_Name = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getName)}"`,
    `${rmgButtonId}_Data = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getData(mappingObject))}"`,
    `${rmgButtonId}_ExtraData = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getExtraData)}"`,
  ];
};

export const getRmgButtonsMapping = (controller: Sdl.Controller.Device) => {
  const mappingObject = createSdlMappingObject(controller.mapping!);

  return Object.entries(rmgButtonIds).flatMap(([rmgButtonId, emuzeButtonIds]) =>
    getRmgButtonMapping(
      mappingObject,
      rmgButtonId as RmgButtonId,
      emuzeButtonIds,
    ),
  );
};

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (controller: Sdl.Joystick.Device | Sdl.Controller.Device, index: number) => {
    log("debug", "gamepad", { index, controller });
    const { name, path } = controller;

    if (name && path) {
      const deviceSerial =
        (isController(controller)
          ? sdl.controller.openDevice(controller)
          : sdl.joystick.openDevice(controller)
        ).serialNumber || "";

      return [
        `[Rosalie's Mupen GUI - Input Plugin Profile ${playerIndexArray[index]}]`,
        `PluggedIn = True`,
        `DeviceName = "${name}"`,
        `DeviceType = 4`,
        `DevicePath = "${path}"`,
        `DeviceSerial = "${deviceSerial}"`,
        `Deadzone = 9`,
        `Sensitivity = 100`,
        `Pak = 0`,
        `RemoveDuplicateMappings = True`,
        `FilterEventsForButtons = True`,
        `FilterEventsForAxis = True`,
        // TODO: use when sdl3 is integrated
        // ...getRmgButtonsMapping(controller),
        normalizeNewLines(`DpadUp_InputType = "0"
DpadUp_Name = "dpup"
DpadUp_Data = "11"
DpadUp_ExtraData = "0"
DpadDown_InputType = "0"
DpadDown_Name = "dpdown"
DpadDown_Data = "12"
DpadDown_ExtraData = "0"
DpadLeft_InputType = "0"
DpadLeft_Name = "dpleft"
DpadLeft_Data = "13"
DpadLeft_ExtraData = "0"
DpadRight_InputType = "0"
DpadRight_Name = "dpright"
DpadRight_Data = "14"
DpadRight_ExtraData = "0"
Start_InputType = "0"
Start_Name = "start"
Start_Data = "6"
Start_ExtraData = "0"
A_InputType = "0"
A_Name = "a"
A_Data = "0"
A_ExtraData = "0"
B_InputType = "0"
B_Name = "x"
B_Data = "2"
B_ExtraData = "0"
LeftTrigger_InputType = "0"
LeftTrigger_Name = "leftshoulder"
LeftTrigger_Data = "9"
LeftTrigger_ExtraData = "0"
RightTrigger_InputType = "0"
RightTrigger_Name = "rightshoulder"
RightTrigger_Data = "10"
RightTrigger_ExtraData = "0"
ZTrigger_InputType = "1"
ZTrigger_Name = "lefttrigger+"
ZTrigger_Data = "4"
ZTrigger_ExtraData = "1"
AnalogStickUp_InputType = "1"
AnalogStickUp_Name = "lefty-"
AnalogStickUp_Data = "1"
AnalogStickUp_ExtraData = "0"
AnalogStickDown_InputType = "1"
AnalogStickDown_Name = "lefty+"
AnalogStickDown_Data = "1"
AnalogStickDown_ExtraData = "1"
AnalogStickLeft_InputType = "1"
AnalogStickLeft_Name = "leftx-"
AnalogStickLeft_Data = "0"
AnalogStickLeft_ExtraData = "0"
AnalogStickRight_InputType = "1"
AnalogStickRight_Name = "leftx+"
AnalogStickRight_Data = "0"
AnalogStickRight_ExtraData = "1"
CButtonUp_InputType = "1"
CButtonUp_Name = "righty-"
CButtonUp_Data = "3"
CButtonUp_ExtraData = "0"
CButtonDown_InputType = "1;0"
CButtonDown_Name = "righty+;b"
CButtonDown_Data = "3;1"
CButtonDown_ExtraData = "1;0"
CButtonLeft_InputType = "1;0"
CButtonLeft_Name = "rightx-;y"
CButtonLeft_Data = "2;3"
CButtonLeft_ExtraData = "0;0"
CButtonRight_InputType = "1"
CButtonRight_Name = "rightx+"
CButtonRight_Data = "2"
CButtonRight_ExtraData = "1"`),
      ].join(EOL);
    }

    return "";
  };

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [
    `[Rosalie's Mupen GUI - Input Plugin Profile ${gamepadIndex}]`,
    `PluggedIn = False`,
    `DeviceName = "None"`,
    `DeviceType = 0`,
    `DevicePath = ""`,
    `DeviceSerial = ""`,
  ].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = isSteamOs() ? sdl.joystick.devices : sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(playerIndexArray))
      : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(4, gamepads.length, getVirtualGamepadReset),
  ];
};
