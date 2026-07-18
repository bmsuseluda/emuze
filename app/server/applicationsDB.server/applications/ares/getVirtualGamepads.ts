import type { SdlButtonMapping } from "../../../../types/gamepad.js";
import { isN64Controller, isPs3Controller } from "../../../../types/gamepad.js";
import { log } from "../../../debug.server.js";
import {
  DetectSdlGuidIndex,
  EmuzeController,
  getControllers,
  getSdlGuidIndex,
} from "../../../gamepad.server.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { getKeyboard } from "./keyboardConfig.js";
import { PhysicalGamepad } from "./PhysicalGamepad.js";
import {
  getVirtualGamepadButtonReset,
  getVirtualGamepadReset,
} from "./VirtualGamepadReset.js";
import type {
  GamepadGroupId,
  PhysicalGamepadButton,
  VirtualGamepad,
} from "./types.js";
import type { SystemId } from "../../../categoriesDB.server/systemId.js";

const gamepadGroupId: Record<GamepadGroupId, number> = {
  Axis: 0,
  HAT: 1,
  Button: 3,
};

const getPhysicalGamepadString = (
  physicalGamepadButton: PhysicalGamepadButton | null,
) =>
  physicalGamepadButton?.inputId
    ? [
        physicalGamepadButton.deviceId,
        gamepadGroupId[physicalGamepadButton.groupId].toString(),
        physicalGamepadButton.inputId,
        physicalGamepadButton.qualifier || null,
      ]
        .filter(Boolean)
        .join("/")
    : null;

const getVirtualGamepadButton = (
  virtualGamepad: VirtualGamepad,
  ...physicalGamepadButtons: (PhysicalGamepadButton | null)[]
) => {
  const physicalGamepadStrings = physicalGamepadButtons
    .map(getPhysicalGamepadString)
    .filter(Boolean);

  if (physicalGamepadStrings.length > 0) {
    const virtualGamepadString = [
      `VirtualPad${virtualGamepad.gamepadIndex + 1}`,
      virtualGamepad.buttonId,
    ].join("/");

    return [
      "--setting",
      `${virtualGamepadString}=${physicalGamepadStrings.join(";")}`,
    ];
  }

  return getVirtualGamepadButtonReset(virtualGamepad);
};

/**
 * Maps dpad if available, else left stick.
 */
const getVirtualGamepadDpad = (
  gamepadIndex: number,
  mappingObject: SdlButtonMapping,
  physicalGamepad: PhysicalGamepad,
  systemHasAnalogStick: boolean,
  controller: EmuzeController,
) => {
  log("debug", "mappingObject", mappingObject);
  if (mappingObject.dpup) {
    if (isPs3Controller(controller.sdlController)) {
      //     button
      return [
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Left" },
          physicalGamepad.getDpadLeft(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickLeft() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Right" },
          physicalGamepad.getDpadRight(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickRight() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Up" },
          physicalGamepad.getDpadUp(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickUp() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Down" },
          physicalGamepad.getDpadDown(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickDown() : null,
        ),
      ];
    } else {
      //     hat
      return [
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Left" },
          physicalGamepad.getDpadHatLeft(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickLeft() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Right" },
          physicalGamepad.getDpadHatRight(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickRight() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Up" },
          physicalGamepad.getDpadHatUp(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickUp() : null,
        ),
        ...getVirtualGamepadButton(
          { gamepadIndex, buttonId: "Pad.Down" },
          physicalGamepad.getDpadHatDown(),
          !systemHasAnalogStick ? physicalGamepad.getLeftStickDown() : null,
        ),
      ];
    }
  } else {
    //   map left stick to dpad
    return [
      ...getVirtualGamepadButton(
        { gamepadIndex, buttonId: "Pad.Up" },
        physicalGamepad.getLeftStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex, buttonId: "Pad.Down" },
        physicalGamepad.getLeftStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex, buttonId: "Pad.Left" },
        physicalGamepad.getLeftStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex, buttonId: "Pad.Right" },
        physicalGamepad.getLeftStickRight(),
      ),
    ];
  }
};

const guidOverwrites: Record<string, string> = {
  "03008fe54c050000c405000000006800": "05008fe54c050000c405000000006800",
};

export const createDeviceId = (
  { guid }: EmuzeController,
  guidIndex: number,
) => {
  const guidConverted = guidOverwrites[guid];
  return `${guidConverted || guid}/${guidIndex}`;
};

export const getVirtualGamepad =
  (
    systemId: SystemId,
    systemHasAnalogStick: boolean,
    detectSdlGuidIndex: DetectSdlGuidIndex,
  ) =>
  (controller: EmuzeController, index: number) => {
    const { mappingObject, guid } = controller;
    const guidIndex = detectSdlGuidIndex(guid, index);
    const deviceId = createDeviceId(controller, guidIndex);
    const physicalGamepad = new PhysicalGamepad(deviceId, mappingObject);

    log("debug", "gamepad", { index, controller, deviceId });

    return [
      ...getVirtualGamepadDpad(
        index,
        mappingObject,
        physicalGamepad,
        systemHasAnalogStick,
        controller,
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "Select" },
        physicalGamepad.getBack(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "Start" },
        physicalGamepad.getStart(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "A..South" },
        physicalGamepad.getA(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "B..East" },
        physicalGamepad.getB(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "X..West" },
        physicalGamepad.getX().inputId
          ? physicalGamepad.getX()
          : physicalGamepad.getB(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "Y..North" },
        physicalGamepad.getY(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Bumper" },
        physicalGamepad.getLeftShoulder(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Bumper" },
        physicalGamepad.getRightShoulder(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Trigger" },
        physicalGamepad.getLeftTrigger(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Trigger" },
        isN64Controller(controller.sdlJoystick)
          ? physicalGamepad.getLeftTrigger()
          : physicalGamepad.getRightTrigger(),
        systemId === "nintendo64" ? physicalGamepad.getLeftTrigger() : null,
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Stick..Click" },
        physicalGamepad.getLeftStickClick(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Stick..Click" },
        physicalGamepad.getRightStickClick(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Up" },
        physicalGamepad.getLeftStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Down" },
        physicalGamepad.getLeftStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Left" },
        physicalGamepad.getLeftStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "L-Right" },
        physicalGamepad.getLeftStickRight(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Up" },
        physicalGamepad.getRightStickUp().inputId
          ? physicalGamepad.getRightStickUp()
          : physicalGamepad.getRightButtonUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Down" },
        physicalGamepad.getRightStickDown().inputId
          ? physicalGamepad.getRightStickDown()
          : physicalGamepad.getRightButtonDown(),
        systemId === "nintendo64" ? physicalGamepad.getB() : null,
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Left" },
        physicalGamepad.getRightStickLeft().inputId
          ? physicalGamepad.getRightStickLeft()
          : physicalGamepad.getRightButtonLeft(),
        systemId === "nintendo64" ? physicalGamepad.getY() : null,
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "R-Right" },
        physicalGamepad.getRightStickRight().inputId
          ? physicalGamepad.getRightStickRight()
          : physicalGamepad.getRightButtonRight(),
      ),

      //   To activate rumble, it can be any button
      ...getVirtualGamepadButton(
        { gamepadIndex: index, buttonId: "Rumble" },
        physicalGamepad.getStart(),
      ),
    ];
  };

export const getVirtualGamepads = (
  systemId: SystemId,
  systemHasAnalogStick: boolean,
) => {
  const gamepads = getControllers();
  const detectSdlGuidIndex = getSdlGuidIndex(gamepads);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(
          getVirtualGamepad(systemId, systemHasAnalogStick, detectSdlGuidIndex),
        )
      : getKeyboard();
  log("debug", "gamepads", gamepads.length);

  return [
    ...virtualGamepads.flat(),
    ...resetUnusedVirtualGamepads(
      5,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ).flat(),
  ];
};
