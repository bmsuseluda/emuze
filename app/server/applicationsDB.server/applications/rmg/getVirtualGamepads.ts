import { EOL } from "node:os";
import type {
  EmuzeButtonId,
  SdlButtonMapping,
} from "../../../../types/gamepad.js";
import {
  emuzeToSdlButtonId,
  getButtonIndex,
  getNameIndex,
  isAnalog,
  isDpadHat,
  isXinputController,
} from "../../../../types/gamepad.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { log } from "../../../debug.server.js";
import { keyboardConfig } from "./keyboardConfig.js";
import type { ButtonDetailsFunction, RmgButtonId } from "./types.js";
import { mapAndJoinEmuzeButtonIds, rmgButtonIds } from "./types.js";
import { isWindows } from "../../../operationsystem.server.js";
import { EmuzeController, getControllers } from "../../../gamepad.server.js";
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

const xinputDevicePathWithoutIndex = "XInput#";

const getDevicePath = (
  gamepad: EmuzeController,
  xinputDevicePaths: { name: string }[],
) => {
  if (isWindows()) {
    if (isXinputController(gamepad.type)) {
      const devicePathIndex = getNameIndex(
        xinputDevicePathWithoutIndex,
        xinputDevicePaths.length,
        xinputDevicePaths,
      );
      xinputDevicePaths.push({ name: xinputDevicePathWithoutIndex });
      return `${xinputDevicePathWithoutIndex}${devicePathIndex}`;
    }
    return gamepad.path
      ?.replace("hid", "HID")
      .replace("vid", "VID")
      .replace("pid", "PID");
  } else {
    return gamepad.path;
  }
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

export const getVirtualGamepad =
  (xinputDevicePaths: { name: string }[]) =>
  (emuzeController: EmuzeController, index: number) => {
    log("debug", "gamepad", { index, emuzeController });
    const { serialNumber, nameOsSpecific } = emuzeController;

    const devicePath = getDevicePath(emuzeController, xinputDevicePaths);

    return [
      `[Rosalie's Mupen GUI - Input Plugin Profile ${index}]`,
      `PluggedIn = True`,
      `DeviceName = "${nameOsSpecific}"`,
      `DeviceType = 4`,
      `DevicePath = "${devicePath}"`,
      `DeviceSerial = "${serialNumber || ""}"`,
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
    `DeviceType = 0`,
    `DevicePath = ""`,
    `DeviceSerial = ""`,
  ].join(EOL);

export const getVirtualGamepads = () => {
  const xinputDevicePaths: { name: string }[] = [];
  const gamepads = getControllers();

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(xinputDevicePaths))
      : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(4, gamepads.length, getVirtualGamepadReset),
  ];
};
