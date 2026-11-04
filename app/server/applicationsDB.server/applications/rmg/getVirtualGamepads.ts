import { EOL } from "node:os";
import type {
  EmuzeButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  emuzeToSdlButtonId,
  getButtonIndex,
  isAnalog,
  isDpadHat,
} from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { log } from "../../../debug.server.js";
import { keyboardConfig } from "./keyboardConfig.js";
import type { ButtonDetailsFunction, RmgButtonId } from "./types.js";
import { mapAndJoinEmuzeButtonIds, rmgButtonIds } from "./types.js";
import {
  DetectSdlGuidIndex,
  EmuzeController,
  getControllersSdl3,
  getSdlGuidIndex,
} from "../../../gamepad.server.js";
import { normalizeNewLines } from "../../configFile.js";

const getInputType =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) => {
    if (isAnalog(mappingObject, emuzeToSdlButtonId[buttonId].sdlButtonId)) {
      return 3;
    }

    if (isDpadHat(mappingObject, emuzeToSdlButtonId[buttonId].sdlButtonId)) {
      return 4;
    }

    return 2;
  };

const getName =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) => {
    const sdlButtonId = emuzeToSdlButtonId[buttonId].sdlButtonId;
    const buttonIndex = getButtonIndex(mappingObject, sdlButtonId);

    if (isAnalog(mappingObject, sdlButtonId)) {
      const { qualifier } = emuzeToSdlButtonId[buttonId];
      return `axis ${buttonIndex}${qualifier || ""}`;
    }

    if (isDpadHat(mappingObject, sdlButtonId)) {
      return `hat ${buttonIndex?.split(".").join(":")}`;
    }

    return `button ${buttonIndex}`;
  };

const getData =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) => {
    const sdlButtonId = emuzeToSdlButtonId[buttonId].sdlButtonId;
    const buttonIndex = getButtonIndex(mappingObject, sdlButtonId);

    if (isDpadHat(mappingObject, sdlButtonId)) {
      return buttonIndex?.split(".").at(0);
    }

    return buttonIndex;
  };

const getExtraData =
  (mappingObject: SdlButtonMapping): ButtonDetailsFunction =>
  (buttonId: EmuzeButtonId) => {
    const sdlButtonId = emuzeToSdlButtonId[buttonId].sdlButtonId;
    if (isDpadHat(mappingObject, sdlButtonId)) {
      const buttonIndex = getButtonIndex(mappingObject, sdlButtonId);
      return buttonIndex?.split(".").at(1);
    }

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
    `${rmgButtonId}_Name = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getName(mappingObject))}"`,
    `${rmgButtonId}_Data = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getData(mappingObject))}"`,
    `${rmgButtonId}_ExtraData = "${mapAndJoinEmuzeButtonIds(emuzeButtonIds, getExtraData(mappingObject))}"`,
  ];
};

export const getRmgButtonsMapping = (
  emuzeController: EmuzeController,
  buttonIds: Partial<Record<RmgButtonId, EmuzeButtonId[]>> = rmgButtonIds,
) => {
  const { mappingObject } = emuzeController;

  return Object.entries(buttonIds).flatMap(([rmgButtonId, emuzeButtonIds]) =>
    getRmgButtonMapping(
      mappingObject,
      rmgButtonId as RmgButtonId,
      emuzeButtonIds,
    ),
  );
};

export const rmgDpadIds = {
  DpadUp: ["dpadUp"],
  DpadDown: ["dpadDown"],
  DpadLeft: ["dpadLeft"],
  DpadRight: ["dpadRight"],
} satisfies Partial<Record<RmgButtonId, EmuzeButtonId[]>>;

const getDpadMapping = (emuzeController: EmuzeController) => {
  const { mappingObject } = emuzeController;

  if (isDpadHat(mappingObject, "dpup")) {
    return getRmgButtonsMapping(emuzeController, rmgDpadIds);
  }

  return [
    normalizeNewLines(`DpadUp_InputType = "4;${getInputType(mappingObject)("dpadUp")}"
DpadUp_Name = "hat 0:1;${getName(mappingObject)("dpadUp")}"
DpadUp_Data = "0;${getData(mappingObject)("dpadUp")}"
DpadUp_ExtraData = "1;${getExtraData(mappingObject)("dpadUp")}"
DpadDown_InputType = "4;${getInputType(mappingObject)("dpadDown")}"
DpadDown_Name = "hat 0:4;${getName(mappingObject)("dpadDown")}"
DpadDown_Data = "0;${getData(mappingObject)("dpadDown")}"
DpadDown_ExtraData = "4;${getExtraData(mappingObject)("dpadDown")}"
DpadLeft_InputType = "4;${getInputType(mappingObject)("dpadLeft")}"
DpadLeft_Name = "hat 0:8;${getName(mappingObject)("dpadLeft")}"
DpadLeft_Data = "0;${getData(mappingObject)("dpadLeft")}"
DpadLeft_ExtraData = "8;${getExtraData(mappingObject)("dpadLeft")}"
DpadRight_InputType = "4;${getInputType(mappingObject)("dpadRight")}"
DpadRight_Name = "hat 0:2;${getName(mappingObject)("dpadRight")}"
DpadRight_Data = "0;${getData(mappingObject)("dpadRight")}"
DpadRight_ExtraData = "2;${getExtraData(mappingObject)("dpadRight")}"`),
  ];
};

export const createDeviceGuid = (
  { guid }: EmuzeController,
  guidIndex: number,
) => {
  return `${guid}/${guidIndex}`;
};

export const getVirtualGamepad =
  (detectSdlGuidIndex: DetectSdlGuidIndex) =>
  (emuzeController: EmuzeController, index: number) => {
    log("debug", "gamepad", { index, emuzeController });
    const { nameOsSpecific, guid } = emuzeController;
    const guidIndex = detectSdlGuidIndex(guid, index);
    const deviceGuid = createDeviceGuid(emuzeController, guidIndex);

    return [
      `[Rosalie's Mupen GUI - Input Plugin Profile ${index}]`,
      `PluggedIn = True`,
      `DeviceName = "${nameOsSpecific}"`,
      `DeviceGuid = "${deviceGuid}"`,
      `DeviceType = 4`,
      `Deadzone = 9`,
      `Sensitivity = 100`,
      `Pak = 0`,
      `RemoveDuplicateMappings = True`,
      `FilterEventsForButtons = True`,
      `FilterEventsForAxis = True`,
      ...getDpadMapping(emuzeController),
      ...getRmgButtonsMapping(emuzeController),
    ].join(EOL);
  };

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [
    `[Rosalie's Mupen GUI - Input Plugin Profile ${gamepadIndex}]`,
    `PluggedIn = False`,
    `DeviceName = "None"`,
    `DeviceGuid = ""`,
    `DeviceType = 0`,
    `DevicePath = ""`,
    `DeviceSerial = ""`,
  ].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = getControllersSdl3();
  const detectSdlGuidIndex = getSdlGuidIndex(gamepads);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(detectSdlGuidIndex))
      : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(4, gamepads.length, getVirtualGamepadReset),
  ];
};
