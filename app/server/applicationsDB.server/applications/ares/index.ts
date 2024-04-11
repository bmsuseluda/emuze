import type {
  Application,
  OptionParamFunction,
} from "~/server/applicationsDB.server/types";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";

type GamepadGroupId = "Axis" | "HAT" | "Button";
const gamepadGroupId: Record<GamepadGroupId, number> = {
  Axis: 0,
  HAT: 1,
  Button: 3,
};

type AresButtonId =
  | "Pad.Up"
  | "Pad.Down"
  | "Pad.Left"
  | "Pad.Right"
  | "Select"
  | "Start"
  | "A..South"
  | "B..East"
  | "X..West"
  | "Y..North"
  | "L-Bumper"
  | "R-Bumper"
  | "L-Trigger"
  | "R-Trigger"
  | "L-Stick..Click"
  | "R-Stick..Click"
  | "L-Up"
  | "L-Down"
  | "L-Left"
  | "L-Right"
  | "R-Up"
  | "R-Down"
  | "R-Left"
  | "R-Right";

type SdlButtonId =
  | "a"
  | "b"
  | "x"
  | "y"
  | "back"
  | "start"
  | "guide"
  | "dpdown"
  | "dpleft"
  | "dpright"
  | "dpup"
  | "leftshoulder"
  | "rightshoulder"
  | "lefttrigger"
  | "righttrigger"
  | "leftstick"
  | "rightstick"
  | "leftx"
  | "lefty"
  | "rightx"
  | "righty";

type SdlButtonMapping = Partial<Record<SdlButtonId, string>>;

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

// TODO: Should this function work for HAT as well?
const getButtonIndex = (
  mappingObject: SdlButtonMapping,
  buttonId: SdlButtonId,
): string | undefined =>
  mappingObject[buttonId]?.replace("b", "").replace("a", "");

type VirtualGamepad = {
  gamepadIndex: number;
  buttonId: AresButtonId;
};

type PhysicalGamepad = {
  deviceId: string;
  groupId: GamepadGroupId;
  inputId?: string;
  qualifier?: "Hi" | "Lo";
};

const getVirtualGamepadButton = (
  virtualGamepad: VirtualGamepad,
  physicalGamepad: PhysicalGamepad,
) => {
  if (physicalGamepad.inputId) {
    const virtualGamepadString = [
      `VirtualPad${virtualGamepad.gamepadIndex + 1}`,
      virtualGamepad.buttonId,
    ].join("/");

    const physicalGamepadString = [
      `0x${physicalGamepad.deviceId}`,
      gamepadGroupId[physicalGamepad.groupId],
      physicalGamepad.inputId,
      physicalGamepad.qualifier || null,
    ]
      .filter(Boolean)
      .join("/");

    return ["--setting", `${virtualGamepadString}=${physicalGamepadString};;`];
  }

  return [];
};

/**
 * Maps dpad if available, else left stick
 *
 * @param deviceId
 * @param gamepadIndex
 * @param mappingObject
 */
const getVirtualGamepadDpad = (
  deviceId: string,
  gamepadIndex: number,
  mappingObject: SdlButtonMapping,
) => {
  const groupId: GamepadGroupId = mappingObject.dpup ? "HAT" : "Axis";
  return [
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Pad.Left" },
      { deviceId, groupId, inputId: "0", qualifier: "Lo" },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Pad.Right" },
      { deviceId, groupId, inputId: "0", qualifier: "Hi" },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Pad.Up" },
      { deviceId, groupId, inputId: "1", qualifier: "Lo" },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Pad.Down" },
      { deviceId, groupId, inputId: "1", qualifier: "Hi" },
    ),
  ];
};

const getVirtualGamepad = (
  { vendor, product, mapping }: Sdl.Controller.Device,
  gamepadIndex: number,
) => {
  const deviceId = `${vendor.toString(16).padStart(3, "0")}${product.toString(16).padStart(4, "0")}`;

  const mappingObject = createSdlMappingObject(mapping);

  console.log({ mapping, deviceId, vendor, product });

  return [
    ...getVirtualGamepadDpad(deviceId, gamepadIndex, mappingObject),

    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Select" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "back"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Start" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "start"),
      },
    ),

    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "A..South" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "a"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "B..East" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "b"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "X..West" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "x"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "Y..North" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "y"),
      },
    ),

    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "L-Bumper" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "leftshoulder"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "R-Bumper" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "rightshoulder"),
      },
    ),

    //   TODO: Does not work on Steam Deck
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "L-Trigger" },
      {
        deviceId,
        groupId: "Axis",
        inputId: getButtonIndex(mappingObject, "lefttrigger"),
        qualifier: "Hi",
      },
    ),
    //   TODO: Does not work on Steam Deck
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "R-Trigger" },
      {
        deviceId,
        groupId: "Axis",
        inputId: getButtonIndex(mappingObject, "righttrigger"),
        qualifier: "Hi",
      },
    ),

    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "L-Stick..Click" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "leftstick"),
      },
    ),
    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "R-Stick..Click" },
      {
        deviceId,
        groupId: "Button",
        inputId: getButtonIndex(mappingObject, "rightstick"),
      },
    ),

    ...getVirtualGamepadButton(
      { gamepadIndex, buttonId: "L-Up" },
      {
        deviceId,
        groupId: "Axis",
        inputId: getButtonIndex(mappingObject, "lefty"),
        qualifier: "Lo",
      },
    ),

    "--setting",
    `VirtualPad${gamepadIndex + 1}/L-Up=0x${deviceId}/0/1/Lo;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/L-Down=0x${deviceId}/0/1/Hi;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/L-Left=0x${deviceId}/0/0/Lo;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/L-Right=0x${deviceId}/0/0/Hi;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/R-Up=0x${deviceId}/0/4/Lo;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/R-Down=0x${deviceId}/0/4/Hi;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/R-Left=0x${deviceId}/0/3/Lo;;`,
    "--setting",
    `VirtualPad${gamepadIndex + 1}/R-Right=0x${deviceId}/0/3/Hi;;`,
  ];
};

const getVirtualGamepads = () => {
  const gamepads = sdl.controller.devices;

  return gamepads.flatMap(getVirtualGamepad);
};

const getSharedAresOptionParams: OptionParamFunction = ({
  settings: {
    appearance: { fullscreen },
  },
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
    ...getVirtualGamepads(),
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
  ],
  flatpakId: "dev.ares.ares",
  createOptionParams: getSharedAresOptionParams,
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
