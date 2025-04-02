import type { Application } from "../../types";
import fs from "fs";
import { EOL, homedir } from "os";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import type { SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import { log } from "../../../debug.server";
import { defaultSettings } from "./defaultSettings";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import type { ApplicationId } from "../../applicationId";
import { keyboardConfig } from "./keyboardConfig";

const flatpakId = "net.pcsx2.PCSX2";
const applicationId: ApplicationId = "pcsx2";
const bundledPathLinux = nodepath.join(
  applicationId,
  "pcsx2-v2.2.0-linux-appimage-x64-Qt.AppImage",
);
const bundledPathWindows = nodepath.join(applicationId, "pcsx2-qt.exe");
const configFileName = "PCSX2.ini";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, sdlDevice });

  return [
    `[Pad${index + 1}]`,
    "Type = DualShock2",
    "InvertL = 0",
    "InvertR = 0",
    "Deadzone = 0",
    "AxisScale = 1.33",
    "LargeMotorScale = 1",
    "SmallMotorScale = 1",
    "ButtonDeadzone = 0",
    "PressureModifier = 0.5",
    `Up = SDL-${index}/DPadUp`,
    `Right = SDL-${index}/DPadRight`,
    `Down = SDL-${index}/DPadDown`,
    `Left = SDL-${index}/DPadLeft`,
    `Triangle = SDL-${index}/Y`,
    `Circle = SDL-${index}/B`,
    `Cross = SDL-${index}/A`,
    `Square = SDL-${index}/X`,
    `Select = SDL-${index}/Back`,
    `Start = SDL-${index}/Start`,
    `L1 = SDL-${index}/LeftShoulder`,
    `R1 = SDL-${index}/RightShoulder`,
    `L2 = SDL-${index}/+LeftTrigger`,
    `R2 = SDL-${index}/+RightTrigger`,
    `L3 = SDL-${index}/LeftStick`,
    `R3 = SDL-${index}/RightStick`,
    `LLeft = SDL-${index}/-LeftX`,
    `LRight = SDL-${index}/+LeftX`,
    `LDown = SDL-${index}/+LeftY`,
    `LUp = SDL-${index}/-LeftY`,
    `RLeft = SDL-${index}/-RightX`,
    `RRight = SDL-${index}/+RightX`,
    `RDown = SDL-${index}/+RightY`,
    `RUp = SDL-${index}/-RightY`,
    "",
    "",
    "",
  ].join(EOL);
};

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.controller.devices;

  const virtualGamepads =
    gamepads.length > 0 ? gamepads.map(getVirtualGamepad) : [keyboardConfig];

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(
      8,
      virtualGamepads.length,
      getVirtualGamepadReset,
    ),
  ];
};

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(...getVirtualGamepads());
      } else if (section.startsWith("[Pad]") || !section.startsWith("[Pad")) {
        accumulator.push(section);
      }

      return accumulator;
    }, []);
  } else {
    return [...sections, getVirtualGamepads().join(EOL)];
  }
};

export const replaceHotkeyConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", [
    "OpenPauseMenu = Keyboard/F2",
    "ToggleFullscreen = Keyboard/F11",
    "SaveStateToSlot = Keyboard/F1",
    "LoadStateFromSlot = Keyboard/F3",
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", ["CheckAtStartup = false"]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    "SDL = true",
    "SDLControllerEnhancedMode = true",
  ]);

export const replaceUiConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[UI]", ["ConfirmShutdown = false"]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replacePadConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Pad]", ["MultitapPort1 = true"]);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "PCSX2",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const getConfigFilePath = (configFileName: string) => {
  if (isWindows()) {
    return nodepath.join(
      homedir(),
      "Documents",
      "PCSX2",
      "inis",
      configFileName,
    );
  } else {
    return nodepath.join(homedir(), ".config", "PCSX2", "inis", configFileName);
  }
};

export const replaceConfigSections = () => {
  const filePath = getConfigFilePath(configFileName);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceUiConfig,
    replaceInputSourcesConfig,
    // replacePadConfig,
    replaceHotkeyConfig,
    replaceGamepadConfig,
    replaceAutoUpdaterConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const pcsx2: Application = {
  id: applicationId,
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  flatpakId,
  flatpakOptionParams: ["--command=pcsx2-qt"],
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceConfigSections();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
