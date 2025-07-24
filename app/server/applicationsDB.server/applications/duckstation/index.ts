import type { Application } from "../../types.js";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { log } from "../../../debug.server.js";
import fs from "node:fs";
import { EOL, homedir } from "node:os";
import { isWindows } from "../../../operationsystem.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import nodepath from "node:path";
import { defaultSettings } from "./defaultSettings.js";
import type { ApplicationId } from "../../applicationId.js";
import { keyboardConfig } from "./keyboardConfig.js";
import { envPaths } from "../../../envPaths.server.js";

const flatpakId = "org.duckstation.DuckStation";
const applicationId: ApplicationId = "duckstation";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "duckstation-qt-x64-ReleaseLTCG.exe",
);
const configFileName = "settings.ini";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Joystick.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, sdlDevice });

  return [
    `[Pad${index + 1}]`,
    `Type = AnalogController`,
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
    `Analog = SDL-${index}/Guide`,
    `SmallMotor = SDL-${index}/SmallMotor`,
    `LargeMotor = SDL-${index}/LargeMotor`,
    "",
    "",
    "",
  ].join(EOL);
};

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [`[Pad${gamepadIndex + 1}]`, "Type = None", "", "", ""].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.joystick.devices;

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
  const virtualGamepads = getVirtualGamepads();
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(...virtualGamepads);
      } else if (!section.startsWith("[Pad")) {
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
      keyValue: "SaveSelectedSaveState = Keyboard/F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "LoadSelectedSaveState = Keyboard/F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", [
    { keyValue: "CheckAtStartup = false" },
  ]);

export const replaceMainConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Main]", [
    { keyValue: "ConfirmPowerOff = false" },
    { keyValue: "SetupWizardIncomplete = false" },
  ]);

export const replaceGameListConfig =
  (psxRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[GameList]", [
      { keyValue: `RecursivePaths = ${psxRomsPath}` },
    ]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    { keyValue: "SDL = true" },
    { keyValue: "SDLControllerEnhancedMode = true" },
  ]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replaceControllerPortsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[ControllerPorts]", [
    { keyValue: "MultitapMode = Port1Only" },
  ]);

const { data } = envPaths("duckstation", { suffix: "" });

export const getConfigFilePath = (configFileName: string) => {
  if (isWindows()) {
    return nodepath.join(homedir(), "Documents", "DuckStation", configFileName);
  } else {
    return nodepath.join(data, configFileName);
  }
};

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "duckstation",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultSettings;
  }
};

export const replaceConfigSections = async (psxRomsPath: string) => {
  const filePath = getConfigFilePath(configFileName);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInputSourcesConfig,
    // replaceControllerPortsConfig,
    replaceMainConfig,
    replaceHotkeyConfig,
    replaceGamepadConfig,
    replaceAutoUpdaterConfig,
    replaceGameListConfig(psxRomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const duckstation: Application = {
  id: applicationId,
  name: "DuckStation (Legacy)",
  fileExtensions: [".chd", ".cue"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const psxRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replaceConfigSections(psxRomsPath);

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
