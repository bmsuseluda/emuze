import type { Application, OptionParamFunction } from "../../types";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { log } from "../../../debug.server";
import type {
  AresButtonId,
  GamepadGroupId,
  PhysicalGamepadButton,
  SdlButtonId,
  SdlButtonMapping,
} from "./types";
import { PhysicalGamepad } from "./PhysicalGamepad";

const gamepadGroupId: Record<GamepadGroupId, number> = {
  Axis: 0,
  HAT: 1,
  Button: 3,
};

/**
 *
 * @param sdlMapping "030000004c050000c405000000010000,PS4 Controller,platform:Windows,a:b1,b:b2,back:b8,dpdown:h0.4,dpleft:h0.8,dpright:h0.2,dpup:h0.1,guide:b12,leftshoulder:b4,leftstick:b10,lefttrigger:a3,leftx:a0,lefty:a1,rightshoulder:b5,rightstick:b11,righttrigger:a4,rightx:a2,righty:a5,start:b9,x:b0,y:b3,"
 */
const createSdlMappingObject = (sdlMapping: string) =>
  sdlMapping
    .split(",")
    .reduce<SdlButtonMapping>((accumulator, currentValue) => {
      if (currentValue.includes(":")) {
        const [key, value] = currentValue.split(":");
        accumulator[key as SdlButtonId] = value;
      }
      return accumulator;
    }, {});

interface VirtualGamepad {
  gamepadIndex: number;
  buttonId: AresButtonId;
}

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
      //   TODO: check if it is a problem if there are less then 3 ';'
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

const getVirtualGamepad =
  (systemHasAnalogStick: boolean) =>
  ({ vendor, product, mapping, id }: Sdl.Controller.Device) => {
    const deviceIdIndex = getIndexForDeviceId(id);
    const deviceId = `0x${deviceIdIndex}${vendor.toString(16).padStart(deviceIdIndex.length > 0 ? 4 : 3, "0")}${product.toString(16).padStart(4, "0")}`;

    const mappingObject = createSdlMappingObject(mapping);
    const physicalGamepad = new PhysicalGamepad(deviceId, mappingObject);

    return [
      ...getVirtualGamepadDpad(
        id,
        mappingObject,
        physicalGamepad,
        systemHasAnalogStick,
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "Select" },
        physicalGamepad.getBack(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "Start" },
        physicalGamepad.getStart(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "A..South" },
        physicalGamepad.getA(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "B..East" },
        physicalGamepad.getB(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "X..West" },
        physicalGamepad.getX(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "Y..North" },
        physicalGamepad.getY(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Bumper" },
        physicalGamepad.getLeftShoulder(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Bumper" },
        physicalGamepad.getRightShoulder(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Trigger" },
        physicalGamepad.getLeftTrigger(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Trigger" },
        physicalGamepad.getRightTrigger(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Stick..Click" },
        physicalGamepad.getLeftStickClick(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Stick..Click" },
        physicalGamepad.getRightStickClick(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Up" },
        physicalGamepad.getLeftStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Down" },
        physicalGamepad.getLeftStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Left" },
        physicalGamepad.getLeftStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "L-Right" },
        physicalGamepad.getLeftStickRight(),
      ),

      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Up" },
        physicalGamepad.getRightStickUp(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Down" },
        physicalGamepad.getRightStickDown(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Left" },
        physicalGamepad.getRightStickLeft(),
      ),
      ...getVirtualGamepadButton(
        { gamepadIndex: id, buttonId: "R-Right" },
        physicalGamepad.getRightStickRight(),
      ),
    ];
  };

const getVirtualGamepads = (systemHasAnalogStick: boolean) => {
  const gamepads = sdl.controller.devices;

  log("debug", "gamepads", gamepads);

  return gamepads.flatMap(getVirtualGamepad(systemHasAnalogStick));
};

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
  categoryData: { id },
}) => {
  // keyboard f2
  const hotkeyFullscreen = ["--setting", "Hotkey/ToggleFullscreen=0x1/0/2"];
  // save state F1
  const hotkeySave = ["--setting", "Hotkey/SaveState=0x1/0/1"];
  // load state F3
  const hotkeyLoad = ["--setting", "Hotkey/LoadState=0x1/0/3"];
  const inputSDL = ["--setting", "Input/Driver=SDL"];

  const optionParams = [
    ...hotkeyFullscreen,
    ...hotkeySave,
    ...hotkeyLoad,
    ...inputSDL,
    // ...getVirtualGamepads(categories[id].hasAnalogStick),
    ...getVirtualGamepads(true),
  ];
  if (fullscreen) {
    optionParams.push("--fullscreen");
  }
  return optionParams;
};

export const ares: Application = {
  id: "ares",
  name: "Ares",
  executable: "ares.exe",
  fileExtensions: [
    ".z64",
    ".sms",
    ".gg",
    ".chd",
    ".nes",
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
};

export const aresSuperNintendo: Application = {
  ...ares,
  id: "aresSuperNintendo",
  fileExtensions: [".sfc"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Super Famicom"],
  ],
};

export const aresMegaDrive: Application = {
  ...ares,
  id: "aresMegaDrive",
  fileExtensions: [".sfc", ".smc", ".68K", ".bin"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega Drive"],
  ],
};

export const aresSegaCd: Application = {
  ...ares,
  id: "aresSegaCd",
  fileExtensions: [".chd", ".cue"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega CD"],
  ],
};

export const aresSega32x: Application = {
  ...ares,
  id: "aresSega32x",
  fileExtensions: [".32x"],
  createOptionParams: (...props) => [
    ...getSharedAresOptionParams(...props),
    ...["--system", "Mega 32X"],
  ],
};
