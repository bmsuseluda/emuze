import type { Application } from "../../types";
import type { SectionReplacement } from "../../configFile";
import {
  chainSectionReplacements,
  getFlatpakConfigPath,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile";
import { EOL, homedir } from "os";
import fs from "fs";
import { log } from "../../../debug.server";
import { isWindows } from "../../../operationsystem.server";
import nodepath from "path";
import type { Sdl } from "@kmamal/sdl";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads";
import { defaultGamepadSettings } from "./defaultGamepadSettings";
import { defaultHotkeys } from "./defaultHotkeys";

const flatpakId = "org.DolphinEmu.dolphin-emu";
const gamepadConfigFileName = "GCPadNew.ini";
const hotkeysConfigFileName = "Hotkeys.ini";

export const getVirtualGamepad = (
  sdlDevice: Sdl.Controller.Device,
  index: number,
) => {
  log("debug", "gamepad", { index, sdlDevice });

  return [
    `[GCPad${index + 1}]`,
    `Device = SDL/${index}/${sdlDevice.mapping.split(",")[1]}`,
    `Buttons/A = \`Button E\``,
    `Buttons/B = \`Button S\``,
    `Buttons/X = \`Button N\``,
    `Buttons/Y = \`Button W\``,
    `Buttons/Z = Back`,
    `Buttons/Start = Start`,
    `Main Stick/Up = \`Left Y+\``,
    `Main Stick/Down = \`Left Y-\``,
    `Main Stick/Left = \`Left X-\``,
    `Main Stick/Right = \`Left X+\``,
    `Main Stick/Modifier = \`Shift\``,
    `Main Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
    `C-Stick/Up = \`Right Y+\``,
    `C-Stick/Down = \`Right Y-\``,
    `C-Stick/Left = \`Right X-\``,
    `C-Stick/Right = \`Right X+\``,
    `C-Stick/Modifier = \`Ctrl\``,
    `C-Stick/Calibration = 100.00 141.42 100.00 141.42 100.00 141.42 100.00 141.42`,
    `Triggers/L = \`Shoulder L\``,
    `Triggers/R = \`Shoulder R\``,
    `D-Pad/Up = \`Pad N\``,
    `D-Pad/Down = \`Pad S\``,
    `D-Pad/Left = \`Pad W\``,
    `D-Pad/Right = \`Pad E\``,
    `Triggers/L-Analog = \`Trigger L\``,
    `Triggers/R-Analog = \`Trigger R\``,
    `Rumble/Motor = Weak`,
  ].join(EOL);
};

const getVirtualGamepadReset = (gamepadIndex: number) =>
  [
    `[GCPad${gamepadIndex + 1}]`,
    "Device = XInput2/0/Virtual core pointer",
  ].join(EOL);

export const getVirtualGamepads = () => {
  const gamepads = sdl.controller.devices;

  const virtualGamepads = gamepads.map(getVirtualGamepad);

  return [
    ...virtualGamepads,
    ...resetUnusedVirtualGamepads(4, gamepads.length, getVirtualGamepadReset),
  ];
};

export const replaceGamepadConfigSections: SectionReplacement = (sections) => [
  ...sections,
  getVirtualGamepads().join(EOL),
];

/**
 * returns home folder
 */
export const getWindowsConfigFilePath = (configFileName: string) =>
  nodepath.join(homedir(), "Documents", "dolphin-emu", configFileName);

export const getConfigFilePath = (
  flatpakId: string,
  configFileName: string,
) => {
  if (isWindows()) {
    return getWindowsConfigFilePath(configFileName);
  } else {
    return nodepath.join(
      getFlatpakConfigPath(flatpakId),
      "dolphin-emu",
      configFileName,
    );
  }
};

const readConfigFile = (filePath: string, fallback: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "dolphin",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return fallback;
  }
};

export const replaceGamepadConfigFile = () =>
  replaceConfigSections(
    gamepadConfigFileName,
    defaultGamepadSettings,
    replaceGamepadConfigSections,
  );

export const replaceHotkeysSection: SectionReplacement = (sections) =>
  replaceSection(sections, "[Hotkeys]", [
    "General/Toggle Pause = F2",
    "General/Toggle Fullscreen = F11",
    "Save State/Save State Slot 1 = F1",
    "Load State/Load State Slot 1 = F3",
  ]);

export const replaceHotkeysFile = () =>
  replaceConfigSections(
    hotkeysConfigFileName,
    defaultHotkeys,
    replaceHotkeysSection,
  );

export const replaceConfigSections = (
  configFileName: string,
  fallback: string,
  ...replaceSectionFunctions: SectionReplacement[]
) => {
  const filePath = getConfigFilePath(flatpakId, configFileName);
  const fileContent = readConfigFile(filePath, fallback);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    ...replaceSectionFunctions,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const dolphin: Application = {
  id: "dolphin",
  name: "Dolphin",
  fileExtensions: [".iso", ".rvz"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
  }) => {
    replaceGamepadConfigFile();
    replaceHotkeysFile();

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("--config");
      optionParams.push("Dolphin.Display.Fullscreen=True");
    }
    optionParams.push("--config");
    optionParams.push("Dolphin.Interface.ConfirmStop=False");
    // optionParams.push("--batch");
    return optionParams;
  },
};
