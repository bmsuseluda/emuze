import nodepath from "node:path";
import fs from "node:fs";
import type { ApplicationId } from "../../applicationId.js";
import type { Application } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import type { SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { log } from "../../../debug.server.js";
import { EOL } from "node:os";
import { defaultPpssppSettings } from "./defaultPpssppSettings.js";
import { defaultControlsSettings } from "./defaultControlsSettings.js";
import type { Sdl } from "@kmamal/sdl";
import type { EmuzeButtonId } from "../../../../types/gamepad.js";
import { keyboardMapping } from "../../../../types/gamepad.js";
import { isWindows } from "../../../operationsystem.server.js";

const flatpakId = "org.ppsspp.PPSSPP";
const applicationId: ApplicationId = "ppsspp";
const bundledPathLinux = nodepath.join(
  applicationId,
  `${applicationId}.AppImage`,
);
const getWindowsConfigFolder = () =>
  nodepath.join(process.env.APPDIR || "", "emulators", applicationId);
const bundledPathWindows = nodepath.join(applicationId, "PPSSPPWindows64.exe");

const { config } = envPaths("ppsspp", { suffix: "" });

const ppssppConfigFileName = "ppsspp.ini";
export const getPpssppConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      getWindowsConfigFolder(),
      "memstick",
      "PSP",
      "SYSTEM",
      ppssppConfigFileName,
    );
  } else {
    return nodepath.join(config, "PSP", "SYSTEM", ppssppConfigFileName);
  }
};

const readPpssppConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "ppsspp",
      "ppsspp config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultPpssppSettings;
  }
};

const getSectionPrefix = () => {
  if (isWindows()) {
    return "";
  } else {
    return "﻿";
  }
};

export const replaceGeneralConfig =
  (pspRomsPath: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, `${getSectionPrefix()}[General]`, [
      { keyValue: `FirstRun = False` },
      { keyValue: `CurrentDirectory = ${pspRomsPath}` },
      { keyValue: `CheckForNewVersion = False` },
    ]);

export const replacePpssppConfigFile = (pspRomsPath: string) => {
  const filePath = getPpssppConfigFilePath();
  const fileContent = readPpssppConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig(pspRomsPath),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const keyboardId = 1;
const controller1id = 10;
const controller2id = 11;
const controller360idWindows = 20;

type Scancode = keyof typeof scancodes;
export const scancodes = {
  F1: 131,
  F2: 132,
  F3: 133,
  F11: 141,
  T: 48,
  G: 35,
  F: 34,
  H: 36,
  BACKSPACE: 67,
  RETURN: 66,
  J: 38,
  K: 39,
  U: 49,
  I: 37,
  L: 40,
  O: 43,
  X: 58,
  RSHIFT: 96,
  W: 51,
  S: 47,
  A: 29,
  D: 32,
  "8": 0,
  "9": 0,
} satisfies Partial<Record<Sdl.Keyboard.ScancodeNames, number>>;

const getKeyboardKey = (scancode: Scancode) =>
  `${keyboardId}-${scancodes[scancode]}`;

type PpssppButtonId = Exclude<
  EmuzeButtonId,
  | "rightStickUp"
  | "rightStickDown"
  | "rightStickLeft"
  | "rightStickRight"
  | "leftStick"
  | "rightStick"
>;

const buttonMappingSdl: Record<PpssppButtonId, number> = {
  dpadUp: 19,
  dpadDown: 20,
  dpadLeft: 21,
  dpadRight: 22,
  b: 190,
  a: 189,
  x: 191,
  y: 188,
  start: 197,
  back: 196,
  leftShoulder: 194,
  rightShoulder: 195,
  leftStickUp: 4003,
  leftStickDown: 4002,
  leftStickLeft: 4001,
  leftStickRight: 4000,
  leftTrigger: 4008,
  rightTrigger: 0,
};

const buttonMappingXinput: Record<PpssppButtonId, number> = {
  dpadUp: 19,
  dpadDown: 20,
  dpadLeft: 21,
  dpadRight: 22,
  b: 97,
  a: 96,
  x: 99,
  y: 100,
  start: 108,
  back: 109,
  leftShoulder: 102,
  rightShoulder: 103,
  leftStickUp: 4002,
  leftStickDown: 4003,
  leftStickLeft: 4001,
  leftStickRight: 4000,
  leftTrigger: 4034,
  rightTrigger: 0,
};

const getButtonId = (
  controllerId: number,
  buttonId: PpssppButtonId,
  buttonMapping: Record<PpssppButtonId, number> = buttonMappingSdl,
) => `${controllerId}-${buttonMapping[buttonId]}`;

const getKeyboardKeyForGamepadButton = (buttonId: PpssppButtonId) =>
  getKeyboardKey(keyboardMapping[buttonId]);

const getMappingString = (buttonId: PpssppButtonId) =>
  [
    getKeyboardKeyForGamepadButton(buttonId),
    getButtonId(controller1id, buttonId),
    getButtonId(controller2id, buttonId),
    getButtonId(controller360idWindows, buttonId, buttonMappingXinput),
  ].join(",");

export const replaceControlMappingConfig: SectionReplacement = (sections) =>
  replaceSection(sections, `${getSectionPrefix()}[ControlMapping]`, [
    {
      keyValue: `Up = ${getMappingString("dpadUp")}`,
    },
    {
      keyValue: `Down = ${getMappingString("dpadDown")}`,
    },
    {
      keyValue: `Left = ${getMappingString("dpadLeft")}`,
    },
    {
      keyValue: `Right = ${getMappingString("dpadRight")}`,
    },
    {
      keyValue: `Circle = ${getMappingString("b")}`,
    },
    {
      keyValue: `Cross = ${getMappingString("a")}`,
    },
    {
      keyValue: `Square = ${getMappingString("x")}`,
    },
    {
      keyValue: `Triangle = ${getMappingString("y")}`,
    },
    {
      keyValue: `Start = ${getMappingString("start")}`,
    },
    {
      keyValue: `Select = ${getMappingString("back")}`,
    },
    {
      keyValue: `L = ${getMappingString("leftShoulder")}`,
    },
    {
      keyValue: `R = ${getMappingString("rightShoulder")}`,
    },
    {
      keyValue: `An.Up = ${getMappingString("leftStickUp")}`,
    },
    {
      keyValue: `An.Down = ${getMappingString("leftStickDown")}`,
    },
    {
      keyValue: `An.Left = ${getMappingString("leftStickLeft")}`,
    },
    {
      keyValue: `An.Right = ${getMappingString("leftStickRight")}`,
    },
    {
      keyValue: `Pause = ${getKeyboardKey("F2")},${getButtonId(controller1id, "leftTrigger")}, ${getButtonId(controller2id, "leftTrigger")}`,
    },
    { keyValue: `Save State = ${getKeyboardKey("F1")}` },
    { keyValue: `Load State = ${getKeyboardKey("F3")}` },
    { keyValue: `Toggle Fullscreen = ${getKeyboardKey("F11")}` },
  ]);

const readControlsConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "ppsspp",
      "controls config file can not be read. defaultSettings will be used.",
      error,
    );
    return defaultControlsSettings;
  }
};

const controlsConfigFileName = "controls.ini";
export const getControlsConfigFilePath = () => {
  if (isWindows()) {
    return nodepath.join(
      getWindowsConfigFolder(),
      "memstick",
      "PSP",
      "SYSTEM",
      controlsConfigFileName,
    );
  } else {
    return nodepath.join(config, "PSP", "SYSTEM", controlsConfigFileName);
  }
};

export const replaceControlsConfigFile = () => {
  const filePath = getControlsConfigFilePath();
  const fileContent = readControlsConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceControlMappingConfig,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const ppsspp: Application = {
  id: applicationId,
  name: "PPSSPP",
  fileExtensions: [".chd", ".cso", ".iso"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
    categoryData,
  }) => {
    const pspRomsPath = nodepath.join(categoriesPath, categoryData.name);
    replacePpssppConfigFile(pspRomsPath);
    replaceControlsConfigFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--fullscreen");
    }
    optionParams.push("--pause-menu-exit");
    return optionParams;
  },
  bundledPathLinux,
  bundledPathWindows,
};
