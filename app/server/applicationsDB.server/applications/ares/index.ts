import type { Application, OptionParamFunction } from "../../types";
import type { Sdl } from "@bmsuseluda/node-sdl";
import sdl from "@bmsuseluda/node-sdl";
import { log } from "../../../debug.server";
import type {
  GamepadGroupId,
  PhysicalGamepadButton,
  VirtualGamepad,
} from "./types";
import { PhysicalGamepad } from "./PhysicalGamepad";
import { getVirtualGamepadReset } from "./VirtualGamepadReset";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import type { ApplicationId } from "../../applicationId";
import nodepath from "path";
import { app } from "electron";
import { getKeyboard, getKeyboardKey } from "./keyboardConfig";
import type { SdlButtonMapping } from "../../gamepads";
import { createSdlMappingObject } from "../../gamepads";
import { commandLineOptions } from "../../../commandLine.server";

const applicationId: ApplicationId = "ares";
const bundledPathLinux = nodepath.join(
  applicationId,
  "ares-v142-x86_64.AppImage",
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "ares-v142",
  "ares.exe",
);

const gamepadGroupId: Record<GamepadGroupId, number> = {
  Axis: 0,
  HAT: 1,
  Button: 3,
};

const getPhysicalGamepadString = (
  physicalGamepadButton: PhysicalGamepadButton | null,
) =>
  physicalGamepadButton && physicalGamepadButton.inputId
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

  return [];
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
  if (mappingObject.dpup) {
    if (mappingObject.dpup.startsWith("h")) {
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

const getIndexForDeviceId = (index: number) => {
  if (index > 0) {
    return `${index}`;
  }
  return "";
};

/**
 * Creates the ares specific device id based on the SDL device input.
 *
 * result e.g. 0x128de11ff
 * ? = 0x (is always the same)
 * deviceIndex = 1 (optional, only set if id > 0)
 * vendor = 28de (hex value, needs to be padded with "0" on start to 4 characters, to 3 characters if deviceIndex is set)
 * product = 11ff (hex value, needs to be padded with "0" on start to 4 characters)
 */
export const createDeviceId = ({
  vendor,
  product,
  id,
}: Sdl.Controller.Device) => {
  const deviceIdIndex = getIndexForDeviceId(id);
  return `0x${deviceIdIndex}${vendor.toString(16).padStart(deviceIdIndex.length > 0 ? 4 : 3, "0")}${product.toString(16).padStart(4, "0")}`;
};

export const getVirtualGamepad =
  (systemHasAnalogStick: boolean) =>
  (sdlDevice: Sdl.Controller.Device, index: number) => {
    const virtualGamepadIndex = index;
    const mappingObject = createSdlMappingObject(sdlDevice.mapping);
    const deviceId = createDeviceId(sdlDevice);
    const physicalGamepad = new PhysicalGamepad(deviceId, mappingObject);

    log("debug", "gamepad", { index, sdlDevice, deviceId });

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
        physicalGamepad.getX(),
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
        physicalGamepad.getRightTrigger(),
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
        physicalGamepad.getRightStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Down" },
        physicalGamepad.getRightStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Left" },
        physicalGamepad.getRightStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: virtualGamepadIndex, buttonId: "R-Right" },
        physicalGamepad.getRightStickRight(),
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
  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.flatMap(getVirtualGamepad(systemHasAnalogStick))
      : getKeyboard();
  log("debug", "gamepads", gamepads.length, getKeyboard());

  return [
    ...virtualGamepads,
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

export const aresSega32x: Application = {
  ...ares,
  id: "aresSega32x",
  fileExtensions: [".32x"],
  createOptionParams: (props) => [
    ...getSharedAresOptionParams(props),
    ...["--system", "Mega 32X"],
  ],
};

export const isRmgForN64 = () =>
  app?.commandLine.hasSwitch(commandLineOptions.rmgN64.id) ||
  process.env.EMUZE_RMG_N64 === "true";
