import nodepath from "node:path";
import fs from "node:fs";
import sdl from "@kmamal/sdl3";
import type { ApplicationId } from "../../applicationId.js";
import type { Application, DetectedRequiredFile } from "../../types.js";
import { envPaths } from "../../../envPaths.server.js";
import { log } from "../../../debug.server.js";
import type { SectionReplacement, ParamToReplace } from "../../configFile.js";
import {
  chainSectionReplacements,
  replaceSection,
  splitConfigBySection,
  writeConfig,
} from "../../configFile.js";
import { EOL, homedir } from "node:os";
import {
  handleOperatingSystem,
  isWindows,
} from "../../../operationsystem.server.js";
import { getVirtualGamepads } from "./getVirtualGamepads.js";
import { getKeyboardButtonMappings } from "./keyboardConfig.js";
import { emulatorsConfigDirectory } from "../../../homeDirectory.server.js";
import { sdlGameControllerConfig } from "../../environmentVariables.js";
import {
  ApplicationHotkeys,
  Hotkey,
  hotkeysDefinition,
} from "../../../../types/hotkeys.js";

const applicationId: ApplicationId = "xemu";

const bundledPath = handleOperatingSystem({
  windows: nodepath.join(applicationId, "xemu.exe"),
  mac: nodepath.join(applicationId, "xemu.app"),
  linux: nodepath.join(applicationId, `${applicationId}.AppImage`),
});

const configFileName = "xemu.toml";
const getConfigFilePath = () =>
  nodepath.join(emulatorsConfigDirectory, applicationId, configFileName);

const readConfigFile = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    log(
      "debug",
      "xemu",
      "config file can not be read. defaultSettings will be used.",
      error,
    );
    return ``;
  }
};

const replaceGeneralConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general]", [{ keyValue: "show_welcome = false" }]);

const replaceGeneralUpdatesConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[general.updates]", [
    { keyValue: "check = false" },
  ]);

const hotkeys: ApplicationHotkeys = {
  "Emulator Menu": "guide",
};

const getHotkeyParams = () =>
  Object.entries(hotkeys).flatMap<ParamToReplace>(([key, value]) => [
    {
      keyValue: `${value} = ${sdl.keyboard.SCANCODE[hotkeysDefinition[key as Hotkey].keyboard]}`,
    },
  ]);

const replaceInputBindingsConfig: SectionReplacement = (sections) => {
  const virtualGamepads = getVirtualGamepads();

  return replaceSection(
    sections,
    "[input.bindings]",
    [...virtualGamepads, ...getHotkeyParams()],
    true,
  );
};

const replaceKeyboardControllerConfig: SectionReplacement = (sections) =>
  replaceSection(sections, "[input.keyboard_controller_scancode_map]", [
    ...getKeyboardButtonMappings(),
  ]);

const replaceSysFilesConfig =
  (
    biosFiles: DetectedRequiredFile[],
    otherRequiredFiles: DetectedRequiredFile[],
  ): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[sys.files]", [
      { keyValue: `flashrom_path = '${biosFiles.at(0)!.filePath}'` },
      ...otherRequiredFiles.map<ParamToReplace>(({ type, filePath }) => ({
        keyValue: `${type}_path = '${filePath}'`,
      })),
    ]);

const replaceDisplayQualityConfig =
  (resolution: string): SectionReplacement =>
  (sections) =>
    replaceSection(sections, "[display.quality]", [
      { keyValue: `surface_scale = ${resolution}` },
    ]);

const defaultResolution = "1";

const replaceConfigFile = (
  biosFiles: DetectedRequiredFile[],
  otherRequiredFiles: DetectedRequiredFile[],
  resolution: string,
) => {
  const filePath = getConfigFilePath();
  const fileContent = readConfigFile(filePath);

  const sections = splitConfigBySection(fileContent);

  const fileContentNew = chainSectionReplacements(
    sections,
    replaceGeneralConfig,
    replaceGeneralUpdatesConfig,
    replaceInputBindingsConfig,
    replaceKeyboardControllerConfig,
    replaceDisplayQualityConfig(resolution),
    replaceSysFilesConfig(biosFiles, otherRequiredFiles),
  ).join(EOL);

  writeConfig(filePath, fileContentNew);
};

const getConfigFileBasePath = () => {
  if (isWindows()) {
    return nodepath.join(homedir(), "AppData", "Roaming", "xemu", "xemu");
  } else {
    const { data } = envPaths("xemu", { suffix: "" });

    return nodepath.join(data, "xemu");
  }
};

const requiredFileTypes = {
  bootRom: "bootrom",
  hdd: "hdd",
};

export const xemu: Application = {
  id: applicationId,
  name: "xemu",
  fileExtensions: [".iso", ".xiso"],
  defineEnvironmentVariables: () => ({ ...sdlGameControllerConfig }),
  omitAbsoluteEntryPathAsLastParam: true,
  configFile: {
    basePath: getConfigFileBasePath(),
    files: [configFileName],
  },
  createOptionParams: ({
    settings: {
      appearance: { fullscreen },
    },
    absoluteEntryPath,
    biosFiles,
    otherRequiredFiles,
    emulatorSettings,
  }) => {
    const resolution = emulatorSettings?.resolution || defaultResolution;

    replaceConfigFile(biosFiles!, otherRequiredFiles!, resolution);

    const optionParams = [];
    if (fullscreen) {
      optionParams.push("-full-screen");
    }
    optionParams.push("-dvd_path", absoluteEntryPath);
    return optionParams;
  },
  bundledPath,
  biosFiles: [
    {
      type: "default",
      requiredFiles: [
        {
          filename: "Complex_4627v1.03.bin",
          hash: "1de4c87effe40d44f95581d204f9fa0600fbd5fe2171692316dcf97af0f4113f",
        },
        {
          filename: "Complex_4627.bin",
          hash: "34f1c8ded59116436065783f8ad2ef0939df3cbfc76277ec9e5c41bf9ccb93cd",
        },
      ],
    },
  ],
  otherRequiredFiles: [
    {
      type: requiredFileTypes.bootRom,
      requiredFiles: [
        {
          filename: "mcpx_1.0.bin",
          hash: "e99e3a772bf5f5d262786aee895664eb96136196e37732fe66e14ae062f20335",
        },
      ],
    },
    {
      type: requiredFileTypes.hdd,
      requiredFiles: [{ filename: "xbox_hdd.qcow2" }],
    },
  ],
  settings: [
    {
      id: "resolution",
      label: "Internal Resolution",
      options: [
        { name: "Native", value: defaultResolution },
        { name: "2x", value: "2" },
        { name: "3x", value: "3" },
        { name: "4x", value: "4" },
      ],
    },
  ],
  hotkeys,
};
