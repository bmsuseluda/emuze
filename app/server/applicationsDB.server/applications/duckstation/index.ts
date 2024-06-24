import type { Application } from "../../types";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import { log } from "../../../debug.server";
import fs from "fs";
import { EOL, homedir } from "os";
import { isWindows } from "../../../operationsystem.server";
import {
  chainSectionReplacements,
  findConfigFile,
  getFlatpakConfigPath,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import nodepath from "path";
import { defaultSettings } from "./defaultSettings";

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

export const replaceGamepadConfig = (sections: string[]) => {
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

export const replaceHotkeyConfig = (sections: string[]) =>
  replaceSection(sections, "[Hotkeys]", [
    "OpenPauseMenu = Keyboard/F2",
    "ToggleFullscreen = Keyboard/F11",
    "SaveSelectedSaveState = Keyboard/F1",
    "LoadSelectedSaveState = Keyboard/F3",
  ]);

export const replaceInputSourcesConfig = (sections: string[]) =>
  replaceSection(sections, "[InputSources]", [
    "SDL = true",
    "SDLControllerEnhancedMode = true",
  ]);

/**
 * TODO: Check which game is compatible with multitap
 * TODO: set multitap only if more than 2 controller
 * @param sections
 */
export const replaceControllerPortsConfig = (sections: string[]) =>
  replaceSection(sections, "[ControllerPorts]", ["MultitapMode = Port1Only"]);

const flatpakId = "org.duckstation.DuckStation";
const configFileName = "settings.ini";

/**
 * look into application folder for config file, if not then home folder
 */
export const getWindowsConfigFilePath = (
  configFileName: string,
  applicationPath?: string,
) => {
  if (applicationPath) {
    const applicationDirectory = nodepath.dirname(applicationPath);
    const configFilePath = findConfigFile(applicationDirectory, configFileName);
    const portableExists = fs.existsSync(
      nodepath.join(applicationDirectory, "portable.txt"),
    );

    if (portableExists) {
      if (configFilePath) {
        return configFilePath;
      }
      return nodepath.join(applicationDirectory, configFileName);
    }
  }

  return nodepath.join(homedir(), "Documents", "DuckStation", configFileName);
};

export const configFile = (
  flatpakId: string,
  configFileName: string,
  applicationPath?: string,
) => {
  if (isWindows()) {
    return getWindowsConfigFilePath(configFileName, applicationPath);
  } else {
    return nodepath.join(
      getFlatpakConfigPath(flatpakId),
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

export const replaceConfigSections = (applicationPath?: string) => {
  const filePath = configFile(flatpakId, configFileName, applicationPath);
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceInputSourcesConfig,
    // replaceControllerPortsConfig,
    replaceHotkeyConfig,
    replaceGamepadConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const duckstation: Application = {
  id: "duckstation",
  name: "DuckStation",
  fileExtensions: [".chd", ".cue"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    categoryData: { application },
  }) => {
    const applicationPath = application?.path;
    replaceConfigSections(applicationPath);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-fullscreen");
      optionParams.push("-bigpicture");
      optionParams.push("-batch");
    }
    return optionParams;
  },
};
