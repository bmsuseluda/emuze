import type { Application, OptionParamFunction } from "../../types.js";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server.js";
import type {
  GamepadGroupId,
  PhysicalGamepadButton,
  VirtualGamepad,
} from "./types.js";
import { PhysicalGamepad } from "./PhysicalGamepad.js";
import {
  getVirtualGamepadButtonReset,
  getVirtualGamepadReset,
} from "./VirtualGamepadReset.js";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import type { ApplicationId } from "../../applicationId.js";
import nodepath from "node:path";
import { importElectron } from "../../../importElectron.server.js";
import { getKeyboard, getKeyboardKey } from "./keyboardConfig.js";
import type { SdlButtonMapping } from "../../../../types/gamepad.js";
import {
  createSdlMappingObject,
  getPlayerIndexArray,
  isDpadHat,
  isN64Controller,
} from "../../../../types/gamepad.js";
import { commandLineOptions } from "../../../commandLine.server.js";
import { getJoystickFromController } from "../../../gamepad.server.js";

const applicationId: ApplicationId = "ares";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(applicationId, "ares.exe");

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
) => {
  log("debug", "mappingObject", mappingObject);
  if (mappingObject.dpup) {
    if (isDpadHat(mappingObject, "dpup")) {
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
    } else {
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

const getIndexForDeviceId = (index: number) => `${index + 1}`;

/**
 * Creates the ares specific device id based on the SDL device input.
 *
 * result e.g. 0x1045e02e0 (8bitdo pro 2)
 *
 * 0x1054c05c4 (ds4)
 * 0x2045e02e0 (8bitdo pro 2)
 * 0x3054c0268 (ds3)
 *
 * ? = 0x (is always the same)
 * deviceIndex = 1 (index + 1)
 * vendor = 28de (hex value, needs to be padded with "0" on start to 4 characters, to 3 characters if deviceIndex is set)
 * product = 11ff (hex value, needs to be padded with "0" on start to 4 characters)
 */
export const createDeviceId = (
  { vendor, product }: Sdl.Controller.Device,
  index: number,
) => {
  const deviceIdIndex = getIndexForDeviceId(index);
  return `0x${deviceIdIndex}${vendor?.toString(16).padStart(deviceIdIndex.length > 0 ? 4 : 3, "0")}${product?.toString(16).padStart(4, "0")}`;
};

export const getVirtualGamepad =
  (systemHasAnalogStick: boolean, playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Controller.Device, index: number) => {
    const virtualGamepadIndex = playerIndexArray[index];
    const mappingObject = createSdlMappingObject(sdlDevice.mapping!);
    const deviceId = createDeviceId(sdlDevice, index);
    const physicalGamepad = new PhysicalGamepad(deviceId, mappingObject);
    const joystick = getJoystickFromController(sdlDevice)!;

    log("debug", "gamepad", { index, sdlDevice, deviceId }, joystick.name);

    return [
      ...getVirtualGamepadDpad(
        virtualGamepadIndex,
        mappingObject,
        physicalGamepad,
        systemHasAnalogStick,
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "Select" },
        physicalGamepad.getBack(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "Start" },
        physicalGamepad.getStart(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "A..South" },
        physicalGamepad.getA(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "B..East" },
        physicalGamepad.getB(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "X..West" },
        physicalGamepad.getX().inputId
          ? physicalGamepad.getX()
          : physicalGamepad.getB(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "Y..North" },
        physicalGamepad.getY(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Bumper" },
        physicalGamepad.getLeftShoulder(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Bumper" },
        physicalGamepad.getRightShoulder(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Trigger" },
        physicalGamepad.getLeftTrigger(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Trigger" },
        isN64Controller(joystick)
          ? physicalGamepad.getLeftTrigger()
          : physicalGamepad.getRightTrigger(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Stick..Click" },
        physicalGamepad.getLeftStickClick(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Stick..Click" },
        physicalGamepad.getRightStickClick(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Up" },
        physicalGamepad.getLeftStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Down" },
        physicalGamepad.getLeftStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Left" },
        physicalGamepad.getLeftStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "L-Right" },
        physicalGamepad.getLeftStickRight(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Up" },
        physicalGamepad.getRightStickUp().inputId
          ? physicalGamepad.getRightStickUp()
          : physicalGamepad.getRightButtonUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Down" },
        physicalGamepad.getRightStickDown().inputId
          ? physicalGamepad.getRightStickDown()
          : physicalGamepad.getRightButtonDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Left" },
        physicalGamepad.getRightStickLeft().inputId
          ? physicalGamepad.getRightStickLeft()
          : physicalGamepad.getRightButtonLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Right" },
        physicalGamepad.getRightStickRight().inputId
          ? physicalGamepad.getRightStickRight()
          : physicalGamepad.getRightButtonRight(),
      ),

      //   To activate rumble, it can be any button
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "Rumble" },
        physicalGamepad.getStart(),
      ),
    ];
  };

export const getVirtualGamepads = (systemHasAnalogStick: boolean) => {
  const gamepads = sdl.controller.devices;
  const playerIndexArray = getPlayerIndexArray(sdl.joystick.devices);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(systemHasAnalogStick, playerIndexArray))
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

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
  hasAnalogStick,
}) => {
  const hotkeyFullscreen = [
    "--setting",
    `Hotkey/ToggleFullscreen=${getKeyboardKey("F2")}`,
  ];
  const hotkeySave = ["--setting", `Hotkey/SaveState=${getKeyboardKey("F1")}`];
  const hotkeyLoad = ["--setting", `Hotkey/LoadState=${getKeyboardKey("F3")}`];
  const inputSDL = ["--setting", "Input/Driver=SDL"];

  const optionParams = [
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
    ...inputSDL,
    ...getVirtualGamepads(hasAnalogStick),
    "--no-file-prompt",
  ];
  if (fullscreen) {
    optionParams.push("--fullscreen");
  }
  return optionParams;
};

export const ares: Application = {
  id: "ares",
  name: "ares",
  fileExtensions: [
    ".z64",
    ".n64",
    ".v64",
    ".sms",
    ".gg",
    ".chd",
    ".nes",
    ".fc",
    ".unh",
    ".sgd",
    ".smd",
    ".gb",
    ".gbc",
    ".gba",
    ".cue",
    ".pce",
    ".ngp",
    ".ngc",
  ],
  flatpakId: "dev.ares.ares",
  createOptionParams: getSharedAresOptionParams,
  bundledPathLinux,
  bundledPathWindows,
};

export const aresGameBoyColor: Application = {
  ...ares,
  id: "aresGameBoyColor",
  fileExtensions: [".gb", ".gbc"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Game Boy Color"],
  ],
};

export const aresSuperNintendo: Application = {
  ...ares,
  id: "aresSuperNintendo",
  fileExtensions: [".sfc"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Super Famicom"],
  ],
};

export const aresMegaDrive: Application = {
  ...ares,
  id: "aresMegaDrive",
  fileExtensions: [".sfc", ".smc", ".68K", ".bin", ".md"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega Drive"],
  ],
};

export const aresSegaCd: Application = {
  ...ares,
  id: "aresSegaCd",
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega CD"],
  ],
};

export const aresSegaMegaLd: Application = {
  ...ares,
  id: "aresSegaMegaLd",
  fileExtensions: [".mmi"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega LD"],
  ],
};

export const aresSega32x: Application = {
  ...ares,
  id: "aresSega32x",
  fileExtensions: [".32x"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega 32X"],
  ],
};

export const aresSuperGrafx: Application = {
  ...ares,
  id: "aresSuperGrafx",
  fileExtensions: [".pce"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "SuperGrafx"],
  ],
};

export const isRmgForN64 = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.rmgN64.id) ||
    process.env.EMUZE_RMG_N64 === "true"
  );
};

export const isMgbaForGameBoy = () => {
  const electron = importElectron();

  return (
    electron?.app?.commandLine.hasSwitch(commandLineOptions.mgba.id) ||
    process.env.EMUZE_MGBA === "true"
  );
};
