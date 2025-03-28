import type { Application } from "../../types";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import { log } from "../../../debug.server";
import fs from "fs";
import { EOL, homedir } from "os";
import { isWindows } from "../../../operationsystem.server";
import type { SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import nodepath from "path";
import { defaultSettings } from "./defaultSettings";
import type { ApplicationId } from "../../applicationId";

const flatpakId = "org.duckstation.DuckStation";
const applicationId: ApplicationId = "duckstation";
const bundledPathLinux = nodepath.join(
  applicationId,
  "DuckStation-x64.AppImage",
);
const bundledPathWindows = nodepath.join(
  applicationId,
  "duckstation-qt-x64-ReleaseLTCG.exe",
);
const configFileName = "settings.ini";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
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
  const gamepads = sdl.controller.devices;

  const virtualGamepads = gamepads.map(getVirtualGamepad);

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(8, gamepads.length, getVirtualGamepadReset),
  ];
};

export const replaceGamepadConfig: SectionReplacement = (sections) => {
  if (sections.find((section) => section.startsWith("[Pad1]"))) {
    return sections.reduce<string[]>((accumulator, section) => {
      if (section.startsWith("[Pad1]")) {
        accumulator.push(...getVirtualGamepads());
      } else if (!section.startsWith("[Pad")) {
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
    "SaveSelectedSaveState = Keyboard/F1",
    "LoadSelectedSaveState = Keyboard/F3",
  ]);

export const replaceAutoUpdaterConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[AutoUpdater]", ["CheckAtStartup = false"]);

export const replaceMainConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[Main]", ["ConfirmPowerOff = false"]);

export const replaceInputSourcesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[InputSources]", [
    "SDL = true",
    "SDLControllerEnhancedMode = true",
  ]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replaceControllerPortsConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[ControllerPorts]", ["MultitapMode = Port1Only"]);

export const getConfigFilePath = (configFileName: string) => {
  if (isWindows()) {
    return nodepath.join(homedir(), "Documents", "DuckStation", configFileName);
  } else {
    return nodepath.join(
      homedir(),
      ".local",
      "share",
      "duckstation",
      configFileName,
    );
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

export const replaceConfigSections = () => {
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
