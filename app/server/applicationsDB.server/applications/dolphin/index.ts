import type { Application } from "../../types.js";
import type { ParamToReplace, SectionReplacement } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL } from "node:os";
import fs from "node:fs";
import { log } from "../../../debug.server.js";
import nodepath from "node:path";
import sdl from "@kmamal/sdl";
import { resetUnusedVirtualGamepads } from "../../resetUnusedVirtualGamepads.js";
import { defaultGamepadSettings } from "./defaultGamepadSettings.js";
import { defaultHotkeys } from "./defaultHotkeys.js";
import type { ApplicationId } from "../../applicationId.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { defaultDolphinSettings } from "./defaultDolphinSettings.js";
import { isWindows } from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";

const flatpakId = "org.DolphinEmu.dolphin-emu";
const applicationId: ApplicationId = "dolphin";
const bundledPath = isWindows()
  ? nodepath.join(applicationId, "Dolphin.exe")
  : nodepath.join(applicationId, `${applicationId}.AppImage`);

const configFolderPath = nodepath.join(emulatorsConfigDirectory, applicationId);
const dolphinConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "Dolphin.ini",
);
const gamepadConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "GCPadNew.ini",
);
const hotkeysConfigFileName = nodepath.join(
  configFolderPath,
  "Config",
  "Hotkeys.ini",
);

export const replaceGamepadConfigSections: SectionReplacement = (sections) => [
  ...sections,
  getVirtualGamepads().join(EOL),
];

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
    { keyValue: "General/Toggle Pause = F2", disableParamWithSameValue: true },
    {
      keyValue: "General/Toggle Fullscreen = F11",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "Save State/Save State Slot 1 = F1",
      disableParamWithSameValue: true,
    },
    {
      keyValue: "Load State/Load State Slot 1 = F3",
      disableParamWithSameValue: true,
    },
  ]);

export const replaceHotkeysFile = () =>
  replaceConfigSections(
    hotkeysConfigFileName,
    defaultHotkeys,
    replaceHotkeysSection,
  );

const setDeviceToStandardController = (index: number): ParamToReplace => ({
  keyValue: `SIDevice${index} = 6`,
});

export const replaceDolphinCoreSection: SectionReplacement = (sections) => {
  const gamepads = sdl.joystick.devices;
  const virtualGamepads = gamepads.length > 0 ? gamepads : ["keyboard"];
  const siDevices: ParamToReplace[] = [
    ...virtualGamepads.map((_, index) => setDeviceToStandardController(index)),
    ...resetUnusedVirtualGamepads(
      4,
      virtualGamepads.length,
      (index: number): ParamToReplace => ({
        keyValue: `SIDevice${index} = 0`,
      }),
    ),
  ];

  return replaceSection(sections, "[Core]", siDevices);
};

export const replaceDolphinFile = () =>
  replaceConfigSections(
    dolphinConfigFileName,
    defaultDolphinSettings,
    replaceDolphinCoreSection,
  );

export const replaceConfigSections = (
  filePath: string,
  fallback: string,
  ...replaceSectionFunctions: SectionReplacement[]
) => {
  const fileContent = readConfigFile(filePath, fallback);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    ...replaceSectionFunctions,
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

export const dolphin: Application = {
  id: applicationId,
  name: "Dolphin",
  fileExtensions: [".iso", ".rvz"],
  flatpakId,
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
      general: { categoriesPath },
    },
  }) => {
    replaceDolphinFile();
    replaceGamepadConfigFile();
    replaceHotkeysFile();

    const optionParams = [
      `--user=${configFolderPath}`,
      ...["--config", "Dolphin.Interface.ConfirmStop=False"],
      ...["--config", "Dolphin.Analytics.PermissionAsked=True"],
      ...["--config", "Dolphin.AutoUpdate.UpdateTrack="],
      ...["--config", `Dolphin.General.ISOPath0=${categoriesPath}`],
      ...["--config", "Dolphin.General.ISOPaths=1"],
      ...["--config", "Dolphin.General.RecursiveISOPaths=True"],
    ];

    if (fullscreen) {
      optionParams.push(...["--config", "Dolphin.Display.Fullscreen=True"]);
      optionParams.push("--batch");
    }

    return optionParams;
  },
  bundledPath,
};
