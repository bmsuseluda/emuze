import type { Application } from "../../types.js";
import fs from "node:fs";
import { EOL, homedir } from "os";
import { isWindows } from "../../../operationsystem.server.js";
import nodepath from "node:path";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { log } from "../../../debug.server.js";
import { defaultSettings } from "./defaultSettings.js";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import type { ApplicationId } from "../../applicationId.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { envPaths } from "../../../envPaths.server.js";
import { getPlayerIndexArray } from "../../../../types/gamepad.js";

const flatpakId = "net.pcsx2.PCSX2";
const applicationId: ApplicationId = "pcsx2";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "pcsx2-qt.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);
const configFileName = "PCSX2.ini";

export const getVirtualGamepad =
  (playerIndexArray: number[]) =>
  (sdlDevice: Sdl.Joystick.Device, sdlIndex: number) => {
    log("debug", "gamepad", { sdlIndex, sdlDevice });

    return [
      `[Pad${playerIndexArray[sdlIndex] + 1}]`,
      "Type = DualShock2",
      "InvertL = 0",
      "InvertR = 0",
      "Deadzone = 0",
      "AxisScale = 1.33",
      "LargeMotorScale = 1",
      "SmallMotorScale = 1",
      "ButtonDeadzone = 0",
      "PressureModifier = 0.5",
      `Up = SDL-${sdlIndex}/DPadUp`,
      `Right = SDL-${sdlIndex}/DPadRight`,
      `Down = SDL-${sdlIndex}/DPadDown`,
      `Left = SDL-${sdlIndex}/DPadLeft`,
      `Triangle = SDL-${sdlIndex}/Y`,
      `Circle = SDL-${sdlIndex}/B`,
      `Cross = SDL-${sdlIndex}/A`,
      `Square = SDL-${sdlIndex}/X`,
      `Select = SDL-${sdlIndex}/Back`,
      `Start = SDL-${sdlIndex}/Start`,
      `L1 = SDL-${sdlIndex}/LeftShoulder`,
      `R1 = SDL-${sdlIndex}/RightShoulder`,
      `L2 = SDL-${sdlIndex}/+LeftTrigger`,
      `R2 = SDL-${sdlIndex}/+RightTrigger`,
      `L3 = SDL-${sdlIndex}/LeftStick`,
      `R3 = SDL-${sdlIndex}/RightStick`,
      `LLeft = SDL-${sdlIndex}/-LeftX`,
      `LRight = SDL-${sdlIndex}/+LeftX`,
      `LDown = SDL-${sdlIndex}/+LeftY`,
      `LUp = SDL-${sdlIndex}/-LeftY`,
      `RLeft = SDL-${sdlIndex}/-RightX`,
      `RRight = SDL-${sdlIndex}/+RightX`,
      `RDown = SDL-${sdlIndex}/+RightY`,
      `RUp = SDL-${sdlIndex}/-RightY`,
      "",
      "",
      "",
    ].join(EOL);
  };

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.joystick.devices;
  const playerIndexArray = getPlayerIndexArray(gamepads);

  const virtualGamepads =
    gamepads.length > 0
      ? gamepads.map(getVirtualGamepad(playerIndexArray))
      : [keyboardConfig];

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
  const virtualGamepads = getVirtualGamepads();
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(...virtualGamepads);
      } else if (section.startsWith("[Pad]") || !section.startsWith("[Pad")) {
        accumulator.push(section);
      }

      return accumulator;
    }, []);
  } else {
    return [...sections, virtualGamepads.join(EOL)];
  }
};

export const replaceHotkeyConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", [
    {
      keyValue: "OpenPauseMenu = Keyboard/F2",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "ToggleFullscreen = Keyboard/F11",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "SaveStateToSlot = Keyboard/F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "LoadStateFromSlot = Keyboard/F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", [
    { keyValue: "CheckAtStartup = false" },
  ]);

export const replaceGameListConfig =
  (ps2RomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[GameList]", [
      { keyValue: `RecursivePaths = ${ps2RomsPath}` },
    ]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    { keyValue: "SDL = true" },
    { keyValue: "SDLControllerEnhancedMode = true" },
  ]);

export const replaceUiConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[UI]", [
    { keyValue: "ConfirmShutdown = false" },
    { keyValue: "SetupWizardIncomplete = false" },
  ]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replacePadConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Pad]", [{ keyValue: "MultitapPort1 = true" }]);

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

const { config } = envPaths("PCSX2", { suffix: "" });

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
    return nodepath.join(config, "inis", configFileName);
  }
};

export const replaceConfigSections = (ps2RomsPath: string) => {
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
    replaceGameListConfig(ps2RomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const pcsx2: Application = {
  id: applicationId,
  name: "PCSX2",
  fileExtensions: [".chd", ".iso"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const ps2RomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(ps2RomsPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
  bundledPath,
};
